// Player variables
let player = {
  x: 375,
  y: 550,
  w: 30,
  h: 30,
  xSpeed: 0,
  ySpeed: 0,
  speed: 5,
  gravity: 0.3,
  jumping: false,
  jumpForce: -8,
  currentSize: "normal",
};

function movePlayer() {
  // Apply gravity
  player.ySpeed += player.gravity;

  // Move player xSpeed and ySpeed
  player.x += player.xSpeed;
  player.y += player.ySpeed;

  // Check boundaries
  if (player.x < 0) {
    player.x = 0;
    player.xSpeed = 0; // Left Wall
  }
  if (player.x + player.w > cnv.width) {
    player.x = cnv.width - player.w;
    player.xSpeed = 0; // Right Wall
  }
  if (player.y < 0) {
    player.y = 0;
    player.ySpeed = 0; // Top Wall
  }
  if (player.y + player.h > cnv.height) {
    player.y = cnv.height - player.h;
    player.ySpeed = 0; // Ground
    player.jumping = false; // Jump off Ground
  }
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

function keydownHandler(event) {
  // keyispressed movement
  if (!event.repeat) {
    if (event.code == "ArrowRight") {
      player.xSpeed = player.speed;
      slip = "right";
    } else if (event.code == "ArrowLeft") {
      player.xSpeed = -player.speed;
      slip = "left";
    } else if (event.code == "ArrowUp" && !player.jumping) {
      player.ySpeed = player.jumpForce;
      player.jumping = true;
    } else if (event.code == "ArrowDown") {
      player.ySpeed = player.speed;
    }
  }
}

function keyupHandler(event) {
  if (event.code == "ArrowRight" && player.xSpeed > 0) {
    player.xSpeed = 0;
  } else if (event.code == "ArrowLeft" && player.xSpeed < 0) {
    player.xSpeed = 0;
  } else if (event.code == "ArrowUp" && player.ySpeed < 0) {
    player.ySpeed = 0;
  } else if (event.code == "ArrowDown" && player.ySpeed > 0) {
    player.ySpeed = 0;
  }
}

function nextStage() {
  // Update Stage # & Platforms
  currentStage++;
  if (currentStage === 1) {
    currentPlatforms = stage1Platforms;
    player.x = 375;
    player.y = 550;
  } else if (currentStage === 2) {
    currentPlatforms = stage2Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 3) {
    currentPlatforms = stage3Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 4) {
    currentPlatforms = stage4Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 5) {
    currentPlatforms = stage5Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 6) {
    currentPlatforms = stage6Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 7) {
    currentPlatforms = stage7Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 8) {
    currentPlatforms = stage8Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 9) {
    currentPlatforms = stage9Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 10) {
    currentPlatforms = stage10Platforms;
    player.x = 0;
    player.y = 550;
  } else if (currentStage === 11) {
    currentPlatforms = stage11Platforms;
    player.x = 0;
    player.y = 550;
  } else {
    currentPlatforms = [];
  }

  // Update Player Position
}

function platformCollision() {
  for (let i = 0; i < currentPlatforms.length; i++) {
    let platform = currentPlatforms[i];
    if (
      player.y + player.h > platform.y &&
      player.y < platform.y + platform.h &&
      player.x + player.w > platform.x &&
      player.x < platform.x + platform.w
    ) {
      // Calculate the overlap on each side
      let overlapX =
        Math.min(player.x + player.w, platform.x + platform.w) -
        Math.max(player.x, platform.x);
      let overlapY =
        Math.min(player.y + player.h, platform.y + platform.h) -
        Math.max(player.y, platform.y);

      // Determine the side with the smallest overlap
      if (overlapX < overlapY) {
        // Collision from the side
        if (player.x + player.w / 2 < platform.x + platform.w / 2) {
          // Player collides from the left
          player.x = platform.x - player.w;
        } else {
          // Player collides from the right
          player.x = platform.x + platform.w;
        }
        player.xSpeed = 0;
      } else {
        // Collision from the top or bottom
        if (player.y + player.h / 2 < platform.y + platform.h / 2) {
          // Player collides from the top
          player.y = platform.y - player.h;
          player.ySpeed = 0;
          player.jumping = false;
        } else {
          // Player collides from the bottom
          player.y = platform.y + platform.h;
          player.ySpeed = 0;
        }
      }

      // Check if player touched a teleport platform
      if (platform.teleport) {
        nextStage();
        console.log(currentStage);
        if (currentStage > 11) {
          isGameStarted = false;
        }
      } else if (platform.checkpoint) {
        // Set the checkpoint position
        checkpoints.push({
          x: platform.x,
          y: platform.y,
          stage: platform.stage,
        });
      } else if (platform.lava) {
        deathCounter++;
        // Player touches lava, reset to checkpoint or start
        if (checkpoints.length > 0) {
          // Check if any checkpoints are set
          // Get the last checkpoint position from the checkpoints array
          let lastCheckpoint = checkpoints[checkpoints.length - 1];
          player.x = lastCheckpoint.x + 35;
          player.y = lastCheckpoint.y - 50;
          currentStage = lastCheckpoint.stage;
        } else {
          // Reset to the beginning of stage 1 if no checkpoints are set
          currentStage = 1;
          player.x = 375;
          player.y = 550;
        }
      } else if (platform.spring) {
        player.ySpeed = -10;
      } else if (platform.shrink) {
        player.w = 10;
        player.h = 10;
        currentSize = "small";
      } else if (platform.grow) {
        if (currentSize == "normal" || currentSize == "small") {
          player.w = 50;
          player.h = 50;
          player.y -= 10;
          currentSize = "large";
        }
      } else if (platform.normal) {
        if (currentSize == "small") {
          player.w = 30;
          player.h = 30;
          player.y -= 10;
          currentSize = "normal";
        } else player.w = 30;
        player.h = 30;
        currentSize = "normal";
      } else if (platform.slow) {
        player.speed = 2.5;
        player.jumpForce = -6;
      } else if (platform.speed) {
        player.speed = 7.5;
        player.jumpForce = -10;
      } else if (platform.ice) {
        if (slip == "right") {
          player.xSpeed += 0.05;
        } else player.xSpeed -= 0.05;
      } else if (platform.vanish) {
      }
      break;
    }
  }
}

let stage1Platforms = [
  { x: 100, y: 500, w: 100, h: 5 },
  { x: 300, y: 400, w: 150, h: 5 },
  { x: 550, y: 300, w: 100, h: 5, teleport: true },
];

let stage2Platforms = [
  { x: 100, y: 500, w: 200, h: 5 },
  { x: 450, y: 450, w: 150, h: 5 },
  { x: 200, y: 350, w: 100, h: 5 },
  { x: 575, y: 300, w: 100, h: 5 },
  { x: 300, y: 200, w: 100, h: 5 },
  { x: 500, y: 100, w: 100, h: 5, teleport: true },
];

let stage3Platforms = [
  { x: 600, y: 550, w: 100, h: 5 },
  { x: 450, y: 450, w: 50, h: 5 },
  { x: 300, y: 475, w: 25, h: 5 },
  { x: 200, y: 375, w: 25, h: 5 },
  { x: 350, y: 300, w: 50, h: 5 },
  { x: 500, y: 200, w: 25, h: 5 },
  { x: 700, y: 150, w: 100, h: 5, teleport: true },
];

let stage4Platforms = [
  { x: 200, y: 550, w: 100, h: 5, checkpoint: true, stage: 4 },
  { x: 500, y: 450, w: 50, h: 5 },
  { x: 400, y: 350, w: 100, h: 5 },
  { x: 300, y: 350, w: 100, h: 5, lava: true },
  { x: 150, y: 275, w: 100, h: 5 },
  { x: 450, y: 200, w: 100, h: 5 },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage5Platforms = [
  { x: 200, y: 550, w: 100, h: 5, checkpoint: true, stage: 5 },
  { x: 300, y: 450, w: 50, h: 5 },
  { x: 350, y: 450, w: 100, h: 5, lava: true },
  { x: 450, y: 450, w: 100, h: 5 },
  { x: 600, y: 375, w: 100, h: 5 },
  { x: 600, y: 285, w: 5, h: 40, lava: true },
  { x: 450, y: 275, w: 100, h: 5 },
  { x: 100, y: 250, w: 50, h: 5 },
  { x: 150, y: 250, w: 100, h: 5, lava: true },
  { x: 250, y: 250, w: 100, h: 5 },
  { x: 50, y: 150, w: 50, h: 5 },
  { x: 325, y: 120, w: 50, h: 5 },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage6Platforms = [
  { x: 50, y: 550, w: 100, h: 5, checkpoint: true, stage: 6 },
  { x: 100, y: 450, w: 50, h: 5 },
  { x: 150, y: 400, w: 100, h: 5, lava: true },
  { x: 250, y: 400, w: 50, h: 5 },
  { x: 300, y: 421, w: 50, h: 5 },
  { x: 350, y: 500, w: 100, h: 5, lava: true },
  { x: 350, y: 360, w: 100, h: 5, lava: true },
  { x: 450, y: 450, w: 100, h: 5 },
  { x: 600, y: 400, w: 50, h: 5 },
  { x: 700, y: 350, w: 50, h: 5 },
  { x: 600, y: 250, w: 50, h: 5 },
  { x: 350, y: 300, w: 100, h: 5 },
  { x: 450, y: 255, w: 5, h: 50, lava: true },
  { x: 350, y: 255, w: 5, h: 50, lava: true },
  { x: 350, y: 250, w: 100, h: 5 },
  { x: 150, y: 225, w: 100, h: 5 },
  { x: 250, y: 150, w: 300, h: 5 },
  { x: 350, y: 100, w: 5, h: 50, lava: true },
  { x: 425, y: 100, w: 5, h: 50, lava: true },
  { x: 500, y: 100, w: 5, h: 50, lava: true },
  { x: 250, y: 25, w: 300, h: 5, lava: true },
  { x: 550, y: 150, w: 300, h: 5, lava: true },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage7Platforms = [
  { x: 50, y: 550, w: 100, h: 5, checkpoint: true, stage: 7 },
  { x: 300, y: 450, w: 50, h: 5 },
  { x: 150, y: 425, w: 100, h: 5, lava: true },
  { x: 50, y: 400, w: 50, h: 5, spring: true },
  { x: 500, y: 250, w: 50, h: 5, spring: true },
  { x: 150, y: 300, w: 100, h: 5, lava: true },
  { x: 350, y: 200, w: 100, h: 5, lava: true },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage8Platforms = [
  { x: 0, y: 595, w: 100, h: 5, checkpoint: true, stage: 8 },
  { x: 300, y: 550, w: 50, h: 5 },
  { x: 600, y: 500, w: 50, h: 5, spring: true },
  { x: 700, y: 450, w: 50, h: 5, shrink: true },
  { x: 300, y: 425, w: 50, h: 5 },
  { x: 0, y: 400, w: 100, h: 5 },
  { x: 10, y: 300, w: 90, h: 5 },
  { x: 100, y: 250, w: 5, h: 100, lava: true },
  { x: 50, y: 250, w: 50, h: 5 },
  { x: 200, y: 200, w: 50, h: 5 },
  { x: 350, y: 150, w: 50, h: 5, normal: true },

  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage9Platforms = [
  { x: 0, y: 595, w: 100, h: 5, checkpoint: true, stage: 9 },
  { x: 200, y: 490, w: 50, h: 5, lava: true },
  { x: 200, y: 500, w: 50, h: 5, spring: true },
  { x: 420, y: 340, w: 50, h: 5, lava: true },
  { x: 420, y: 350, w: 50, h: 5, spring: true },
  { x: 620, y: 250, w: 50, h: 5, spring: true },
  { x: 320, y: 70, w: 5, h: 100, lava: true },
  { x: 125, y: 100, w: 100, h: 5, teleport: true },
];

let stage10Platforms = [
  { x: 200, y: 550, w: 10, h: 5 },
  { x: 420, y: 500, w: 10, h: 5 },
  { x: 620, y: 450, w: 10, h: 5 },
  { x: 440, y: 350, w: 30, h: 5, shrink: true },
  { x: 300, y: 350, w: 20, h: 5 },
  { x: 100, y: 300, w: 20, h: 5 },
  { x: 200, y: 225, w: 20, h: 5 },
  { x: 350, y: 175, w: 20, h: 5 },
  { x: 500, y: 125, w: 20, h: 5 },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage11Platforms = [
  { x: 0, y: 595, w: 100, h: 5, checkpoint: true, stage: 11 },
  { x: 200, y: 550, w: 100, h: 5, vanish: true },
  { x: 420, y: 500, w: 10, h: 5 },
  { x: 620, y: 450, w: 10, h: 5 },
  { x: 440, y: 350, w: 30, h: 5, ice: true },
  { x: 300, y: 350, w: 20, h: 5 },
  { x: 100, y: 300, w: 20, h: 5 },
  { x: 200, y: 225, w: 20, h: 5 },
  { x: 350, y: 175, w: 20, h: 5 },
  { x: 500, y: 125, w: 20, h: 5 },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];
