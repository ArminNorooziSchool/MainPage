// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;
let checkpoints = [];
let isGameStarted = false;
let timer = 0;
let deathCounter = 0;

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
};

// Platform variables form stage to stage
let stage1Platforms = [
  { x: 300, y: 500, w: 200, h: 5 },
  { x: 600, y: 400, w: 150, h: 5 },
  { x: 400, y: 350, w: 100, h: 5 },
  { x: 150, y: 250, w: 100, h: 5 },
  { x: 300, y: 150, w: 100, h: 5 },
  { x: 500, y: 50, w: 100, h: 5, teleport: true },
];

let stage2Platforms = [
  { x: 100, y: 500, w: 200, h: 5 },
  { x: 450, y: 400, w: 150, h: 5 },
  { x: 200, y: 300, w: 100, h: 5 },
  { x: 400, y: 250, w: 100, h: 5 },
  { x: 300, y: 150, w: 100, h: 5 },
  { x: 500, y: 50, w: 100, h: 5, teleport: true },
];

let stage3Platforms = [
  { x: 300, y: 550, w: 100, h: 5 },
  { x: 600, y: 450, w: 50, h: 5 },
  { x: 500, y: 400, w: 100, h: 5 },
  { x: 400, y: 375, w: 25, h: 5 },
  { x: 250, y: 300, w: 50, h: 5 },
  { x: 200, y: 200, w: 50, h: 5 },
  { x: 300, y: 150, w: 100, h: 5, teleport: true },
];

let stage4Platforms = [
  { x: 600, y: 550, w: 100, h: 5 },
  { x: 450, y: 450, w: 50, h: 5 },
  { x: 300, y: 475, w: 25, h: 5 },
  { x: 200, y: 375, w: 25, h: 5 },
  { x: 350, y: 300, w: 50, h: 5 },
  { x: 500, y: 200, w: 25, h: 5 },
  { x: 700, y: 150, w: 100, h: 5, teleport: true },
];

let stage5Platforms = [
  { x: 200, y: 550, w: 100, h: 5, checkpoint: true, stage: 5 },
  { x: 500, y: 450, w: 50, h: 5 },
  { x: 400, y: 350, w: 100, h: 5 },
  { x: 300, y: 350, w: 100, h: 5, lava: true },
  { x: 150, y: 275, w: 100, h: 5 },
  { x: 450, y: 200, w: 100, h: 5 },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage6Platforms = [
  { x: 200, y: 550, w: 100, h: 5, checkpoint: true, stage: 6 },
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

let stage7Platforms = [
  { x: 700, y: 550, w: 100, h: 5, checkpoint: true, stage: 7 },
  { x: 600, y: 450, w: 50, h: 5 },
  { x: 400, y: 400, w: 30, h: 5, lava: true },
  { x: 470, y: 400, w: 30, h: 5, lava: true },
  { x: 430, y: 400, w: 40, h: 5 },
  { x: 250, y: 400, w: 100, h: 5 },
  { x: 350, y: 400, w: 5, h: -70, lava: true },
  { x: 100, y: 450, w: 100, h: 5 },
  { x: 0, y: 400, w: 50, h: 5 },
  { x: 100, y: 300, w: 50, h: 5 },
  { x: 150, y: 300, w: 5, h: -70, lava: true },
  { x: 0, y: 250, w: 50, h: 5 },
  { x: 200, y: 200, w: 50, h: 5 },
  { x: 100, y: 200, w: 50, h: 5, lava: true },
  { x: 300, y: 250, w: 50, h: 5 },
  { x: 400, y: 200, w: 25, h: 5 },
  { x: 450, y: 150, w: 100, h: 5, lava: true },
  { x: 475, y: 120, w: 25, h: 5 },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage8Platforms = [
  { x: 50, y: 550, w: 100, h: 5, checkpoint: true, stage: 8 },
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
  { x: 450, y: 255, w: 5, h: 50, lava: true },
  { x: 350, y: 255, w: 5, h: 50, lava: true },
  { x: 350, y: 250, w: 100, h: 5 },
  { x: 150, y: 225, w: 100, h: 5 },
  { x: 250, y: 150, w: 30, h: 5 },
  { x: 310, y: 150, w: 30, h: 5 },
  { x: 370, y: 150, w: 70, h: 5 },
  { x: 460, y: 150, w: 30, h: 5 },
  { x: 520, y: 150, w: 250, h: 5 },
  { x: 350, y: 100, w: 5, h: 50, lava: true },
  { x: 420, y: 0, w: 5, h: 100, lava: true },
  { x: 500, y: 100, w: 5, h: 50, lava: true },
  { x: 570, y: 0, w: 5, h: 100, lava: true },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage9Platforms = [
  { x: 50, y: 550, w: 100, h: 5, checkpoint: true, stage: 9 },
  { x: 300, y: 450, w: 50, h: 5 },
  { x: 150, y: 425, w: 100, h: 5, lava: true },
  { x: 50, y: 400, w: 50, h: 5, spring: true },
  { x: 500, y: 350, w: 50, h: 5, spring: true },
  { x: 150, y: 300, w: 100, h: 5, lava: true },
  { x: 350, y: 200, w: 100, h: 5, lava: true },
  { x: 450, y: 320, w: 5, h: 100, lava: true },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

let stage10Platforms = [
  { x: 0, y: 595, w: 100, h: 5, checkpoint: true, stage: 10 },
  { x: 101, y: 595, w: 700, h: 5, lava: true },
  { x: 300, y: 550, w: 50, h: 5 },
  { x: 450, y: 525, w: 100, h: 5, lava: true },
  { x: 600, y: 500, w: 50, h: 5, spring: true },
  { x: 300, y: 425, w: 50, h: 5 },
  { x: 0, y: 400, w: 100, h: 5 },
  { x: 125, y: 350, w: 100, h: 5, lava: true },
  { x: 0, y: 300, w: 50, h: 5 },
  { x: 200, y: 200, w: 50, h: 5, spring: true },
  { x: 400, y: 100, w: 100, h: 5, lava: true },
  { x: 600, y: 100, w: 100, h: 5, teleport: true },
];

// Current Stage
currentStage = 1;

// Variables for FPS limiting
let lastFrameTime = 0;
const targetFPS = 120;
const targetFrameTime = 1000 / targetFPS;

// Program Loop
function draw(currentTime) {
  if (!isGameStarted) {
    return;
  }

  // Calculate the time difference between the current and last frame
  const deltaTime = currentTime - lastFrameTime;

  // Only update and render the game if enough time has passed
  if (deltaTime >= targetFrameTime) {
    lastFrameTime = currentTime;

    // Logic
    timer++;

    // Apply gravity
    player.ySpeed += player.gravity;

    // Move player xSpeed and ySpeed
    player.x += player.xSpeed;
    player.y += player.ySpeed;

    // Clear canvas
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    // Render timer and death counter
    ctx.font = "40px Consolas";
    ctx.fillStyle = "lightblue";
    ctx.fillText("Time: " + timer, 100, 200);
    ctx.fillText("Deaths: " + deathCounter, 100, 400);

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

    // Check collision with platforms
    let isColliding = false;
    let currentPlatforms;
    if (currentStage === 1) {
      currentPlatforms = stage1Platforms;
    } else if (currentStage === 2) {
      currentPlatforms = stage2Platforms;
    } else if (currentStage === 3) {
      currentPlatforms = stage3Platforms;
    } else if (currentStage === 4) {
      currentPlatforms = stage4Platforms;
    } else if (currentStage === 5) {
      currentPlatforms = stage5Platforms;
    } else if (currentStage === 6) {
      currentPlatforms = stage6Platforms;
    } else if (currentStage === 7) {
      currentPlatforms = stage7Platforms;
    } else if (currentStage === 8) {
      currentPlatforms = stage8Platforms;
    } else if (currentStage === 9) {
      currentPlatforms = stage9Platforms;
    } else if (currentStage === 10) {
      currentPlatforms = stage10Platforms;
    } else if (currentStage === 10) {
      currentPlatforms = stage10Platforms;
    }

    // Check if the player has reached the endgame condition
    if (currentStage === 10 && player.y + player.h < 0) {
      // Game ended, player beat level 10
      isGameStarted = false;
      ctx.font = "60px Consolas";
      ctx.fillStyle = "green";
      ctx.fillText("Congratulations!", 200, 300);
      ctx.fillText("You beat level 10!", 150, 400);
      ctx.fillText("Deaths: " + deathCounter, 250, 500);
      ctx.fillText("Time: " + timer + " Seconds", 300, 600);
      return;
    }

    // Render player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.w, player.h);

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

        isColliding = true;

        // Check if player touched a teleport platform
        if (platform.teleport) {
          currentStage++;
          if (currentStage > 10) {
            stop;
          } else {
            // Continue to the next stage
            player.x = 0;
            player.y = 550;
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
        }

        break;
      }
    }

    // If collision with ground/top, player jump
    if (!isColliding && player.y + player.h === cnv.height) {
      player.jumping = false;
    }

    // Drawing
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    // Draw player
    ctx.fillStyle = "orange";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Draw Platforms based on current stage
    for (let i = 0; i < currentPlatforms.length; i++) {
      let platform = currentPlatforms[i];

      if (platform.teleport) {
        ctx.fillStyle = "purple";
      } else if (platform.checkpoint) {
        ctx.fillStyle = "yellow";
      } else if (platform.lava) {
        ctx.fillStyle = "red";
      } else if (platform.spring) {
        ctx.fillStyle = "green";
      } else {
        ctx.fillStyle = "lightblue";
      }

      ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

      ctx.font = "20px Consolas";
      ctx.fillStyle = "lightblue";
      ctx.fillText("Time: " + (timer / 60).toFixed(3) + " Seconds", 150, 20);
      ctx.fillText("Deaths: " + deathCounter, 550, 20);
    }

    // request another frame
    requestAnimationFrame(draw);
  } else {
    requestAnimationFrame(draw);
  }
}

// Start button click event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    deathCounter = 0;
    timer = 0;
    lastFrameTime = performance.now(); // Initialize last frame time
    requestAnimationFrame(draw);
  }
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

function keydownHandler(event) {
  // keyispressed movement
  if (!event.repeat) {
    if (event.code == "ArrowRight") {
      player.xSpeed = player.speed;
    } else if (event.code == "ArrowLeft") {
      player.xSpeed = -player.speed;
    } else if (event.code == "ArrowUp" && !player.jumping) {
      player.ySpeed = player.jumpForce;
      player.jumping = true;
    } else if (event.code == "ArrowDown") {
      player.ySpeed = player.speed + 5;
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
