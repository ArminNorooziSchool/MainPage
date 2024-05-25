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
  jumping: "false",
  jumpForce: -8,
  currentSize: "normal",
  facing: "none",
  shooting: false,
  health: 300,
};

// healthbar (green) positions
let healthbar = {
  x: 800,
  y: 15,
  w: 300,
  h: 30,
};

// healthbar (red) positions
let backhealthbar = {
  x: 800,
  y: 15,
  w: 300,
  h: 30,
};

// function to move the player
function movePlayer() {
  // Apply gravity
  player.ySpeed += player.gravity;

  // Move player xSpeed and ySpeed
  player.x += player.xSpeed;
  player.y += player.ySpeed;

  // Check boundaries
  if (player.x < 25) {
    player.x = 25;
    player.xSpeed = 0; // Left Wall
  }
  for (let i = 0; i < currentPlatforms.length; i++) {
    if (player.x + player.w > cnv.width - 200) {
      player.x = cnv.width - 200 - player.w;
      player.xSpeed = 0;
    }
  }
  // Right Wall

  if (player.y < 0) {
    player.y = 0;
    player.ySpeed = 0; // Top Wall
  }
  if (player.y + player.h > cnv.height) {
    player.y = cnv.height - player.h;
    player.ySpeed = 0; // Ground
    player.jumping = false; // Jump off Ground
  }
  if (player.health < 0) {
    player.x = 0;
    player.y = 700;
    stage = "death";
  }
}

// key pressed movement
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

function keydownHandler(event) {
  // keyispressed movement
  // changes playerfacing based on last direction moved
  if (!event.repeat) {
    if (event.code == "KeyD" || event.code == "ArrowRight") {
      player.xSpeed = player.speed;
      player.facing = "right";
    } else if (event.code == "KeyA" || event.code == "ArrowLeft") {
      player.xSpeed = -player.speed;
      player.facing = "left";
    } else if (event.code == "KeyW" || event.code == "ArrowUp") {
      player.facing = "up";
      if (player.jumping == false) {
        player.ySpeed = player.jumpForce;
        player.jumping = "oneLeft";
      } else if (player.jumping == "oneLeft") {
        player.ySpeed = player.jumpForce;
        player.jumping = "true";
      }
    } else if (event.code == "KeyS" || event.code == "ArrowDown") {
      player.facing = "down";
      player.ySpeed = player.speed;
      // if you want to shoot it checks for the facing direction and adjusts the X and Y direction Speeds accordingly making it + or -
    } else if (event.code == "Space") {
      if (player.facing == "left") {
        XdirectionSpeed = -20;
        YdirectionSpeed = 0;
      } else if (player.facing == "right") {
        XdirectionSpeed = 20;
        YdirectionSpeed = 0;
      } else if (player.facing == "up") {
        YdirectionSpeed = -20;
        XdirectionSpeed = 0;
      } else {
        YdirectionSpeed = 20;
        XdirectionSpeed = 0;
      }
      // calls bulletmanager with the parameters needed to make a bullet
      bulletManager(player.x, player.y, XdirectionSpeed, YdirectionSpeed);
    }
  }
}
// when a key is let go
function keyupHandler(event) {
  if (
    event.code == "KeyD" ||
    (event.code == "ArrowRight" && player.xSpeed > 0)
  ) {
    player.xSpeed = 0;
  } else if (
    event.code == "KeyA" ||
    (event.code == "ArrowLeft" && player.xSpeed < 0)
  ) {
    player.xSpeed = 0;
  } else if (
    event.code == "KeyW" ||
    (event.code == "ArrowUp" && player.ySpeed < 0)
  ) {
    player.ySpeed = 0;
  } else if (
    event.code == "KeyS" ||
    (event.code == "ArrowDown" && player.ySpeed > 0)
  ) {
    player.ySpeed = 0;
  }
}

// calls and passes the parameters to the enemy manager function to create the enemies, also sets current enemy based on the current stage
function currentEnemy() {
  if (currentStage == 1) {
    enemyManager(550, 550, 3, 1, 5, "melee", 30, 30);
    enemyManager(1100, 300, 3, 1, 5, "melee", 30, 30);
    enemyManager(1500, 600, 3, 1, 5, "melee", 30, 30);
    enemyManager(2000, 600, 3, 1, 5, "melee", 30, 30);
    enemyManager(2100, 200, 3, 1, 5, "melee", 30, 30);
    enemyManager(2300, 300, 3, 1, 5, "melee", 30, 30);
    enemyManager(2400, 500, 3, 1, 5, "melee", 30, 30);
    enemyManager(2800, 200, 3, 1, 5, "melee", 30, 30);
    enemyManager(2900, 200, 3, 1, 5, "melee", 30, 30);
  } else if (currentStage == 2) {
    enemyManager();
    enemyManager();
    enemyManager(5000, 500, 5, 1, 50, "bossLvl2", 100, 100);
  }
}

// enemy collision
function enemyCollision() {
  for (let i = 0; i < enemies.length; i++) {
    let enemi = enemies[i];
    enemi.y += 3;

    if (enemi.y + enemi.h > 730) {
      enemi.y = 730 - enemi.h;
    }

    // collision with bullet
    for (let n = 0; n < bullets.length; n++) {
      if (
        bullets[n].y + bullets[n].h > enemi.y &&
        bullets[n].y < enemi.y + enemi.h &&
        bullets[n].x + bullets[n].w > enemi.x &&
        bullets[n].x < enemi.x + enemi.w
      ) {
        // remove health and remove colliding bullet
        enemies[i].health -= 1;
        bullets.splice(n, 1);
      }
    }
    // collision with platforms
    for (let k = 0; k < currentPlatforms.length; k++) {
      if (
        currentPlatforms[k].y + currentPlatforms[k].h > enemi.y &&
        currentPlatforms[k].y < enemi.y + enemi.h &&
        currentPlatforms[k].x + currentPlatforms[k].w > enemi.x &&
        currentPlatforms[k].x < enemi.x + enemi.w
      ) {
        // Calculate the overlap on each side
        let overlapX =
          Math.min(
            enemi.x + enemi.w,
            currentPlatforms[k].x + currentPlatforms[k].w
          ) - Math.max(enemi.x, currentPlatforms[k].x);
        let overlapY =
          Math.min(
            enemi.y + enemi.h,
            currentPlatforms[k].y + currentPlatforms[k].h
          ) - Math.max(enemi.y, currentPlatforms[k].y);

        // Determine the side with the smallest overlap
        if (overlapX < overlapY) {
          // Collision from the side
          if (
            enemi.x + enemi.w / 2 <
            currentPlatforms[k].x + currentPlatforms[k].w / 2
          ) {
            // enemi collides from the left
            if (enemi.type == "melee") {
              enemi.x = currentPlatforms[k].x - enemi.w;
            } else {
            }
          } else {
            // enemi collides from the right
            if (enemi.type == "melee") {
              enemi.x = currentPlatforms[k].x + enemi.w;
            } else {
            }
          }
        } else {
          // Collision from the top or bottom
          if (
            enemi.y + enemi.h / 2 <
            currentPlatforms[k].y + currentPlatforms[k].h / 2
          ) {
            // enemi collides from the top
            if (enemi.type == "melee") {
              enemi.y = currentPlatforms[k].y - enemi.h;
            } else {
            }
          } else {
            // enemi collides from the bottom
            if (enemi.type == "melee") {
              enemi.y = currentPlatforms[k].y + enemi.h;
            } else {
            }
          }
        }
      }
    }

    // remove health and if health less than 1 remove enemy, add to killz variable

    if (enemies[i].health < 1) {
      enemies.splice(i, 1);
      killz++;
    }

    // collision with player, remove health and healthbar width on collision
    if (
      player.y + player.h > enemi.y &&
      player.y < enemi.y + enemi.h &&
      player.x + player.w > enemi.x &&
      player.x < enemi.x + enemi.w
    ) {
      player.health -= 1;
      healthbar.w -= 1;

      // Calculate the overlap on each side
      let overlapX =
        Math.min(player.x + player.w, enemi.x + enemi.w) -
        Math.max(player.x, enemi.x);
      let overlapY =
        Math.min(player.y + player.h, enemi.y + enemi.h) -
        Math.max(player.y, enemi.y);

      // Determine the side with the smallest overlap
      if (overlapX < overlapY) {
        // Collision from the side
        if (player.x + player.w / 2 < enemi.x + enemi.w / 2) {
          // Player collides from the left
          player.x = enemi.x - player.w;
        } else {
          // Player collides from the right
          player.x = enemi.x + enemi.w;
        }
      } else {
        // Collision from the top or bottom
        if (player.y + player.h / 2 < enemi.y + enemi.h / 2) {
          // Player collides from the top
          player.y = enemi.y - player.h;
        } else {
          // Player collides from the bottom
          player.y = enemi.y + enemi.h;
        }
      }
    }
    // collision with another enemy
    for (let j = 0; j < enemies.length; j++) {
      if (i != j) {
        if (
          enemies[j].y + enemies[j].h > enemi.y &&
          enemies[j].y < enemi.y + enemi.h &&
          enemies[j].x + enemies[j].w > enemi.x &&
          enemies[j].x < enemi.x + enemi.w
        ) {
          // Calculate the overlap on each side
          let overlapX =
            Math.min(enemies[j].x + enemies[j].w, enemi.x + enemi.w) -
            Math.max(enemies[j].x, enemi.x);
          let overlapY =
            Math.min(enemies[j].y + enemies[j].h, enemi.y + enemi.h) -
            Math.max(enemies[j].y, enemi.y);

          // Determine the side with the smallest overlap
          if (overlapX < overlapY) {
            // Collision from the side
            if (enemies[j].x + enemies[j].w / 2 < enemi.x + enemi.w / 2) {
              // enemies[j] collides from the left
              enemies[j].x = enemi.x - enemies[j].w;
            } else {
              // enemies[j] collides from the right
              enemies[j].x = enemi.x + enemi.w;
            }
          } else {
            // Collision from the top or bottom
            if (enemies[j].y + enemies[j].h / 2 < enemi.y + enemi.h / 2) {
              // enemies[j] collides from the top
              enemies[j].y = enemi.y - enemies[j].h;
            } else {
              // enemies[j] collides from the bottom
              enemies[j].y = enemi.y + enemi.h;
            }
          }
        }
      }
    }
  }
}

// player collision with platforms
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
      if (platform.Start) {
        stage = "selector";
      } else if (platform.checkpoint) {
        // Set the checkpoint position
        checkpoints.push({
          x: platform.x,
          y: platform.y,
          stage: platform.stage,
        });
      } else if (platform.lava) {
        player.x = 0;
        player.y = 700;
        stage = "death";
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
        // continue is non-functional
      } else if (platform.Continue) {
        prompt("Code");
        // level platforms will allow you to play the level that they contain within their object
      } else if (platform.Level) {
        levelselection = map[i].LevelNum;
        // if player wants to play level then set stage to level and initialize enemies, reset healthbar, reset health, player position and timer
        if (+map[i].LevelNum - 1 !== levelsComplete) {
          alert(`Please Complete Level ${+map[i].LevelNum - 1}`);
        } else {
          if (confirm(`Would you like to play Level ${map[i].LevelNum}?`)) {
            console.log(levelselection);
            currentPlatforms = eval("levelPlatforms" + levelselection);
            stage = "level";
            currentStage = levelselection;
            currentEnemy();
            player.x = 0;
            player.y = 400;
            player.health = 300;
            healthbar.w = 300;
            timer = 0;
          }
        }
        // if you touch finish platform, endLevel will be called
      } else if (platform.finish) {
        endLevel();
      }
      break;
    }
  }
}

// if conditions are met then the level will end
function endLevel() {
  if (currentStage == 1) {
    if (killz == 9) {
      stage = "finish";
      killz = 0;
      player.x = 0;
      player.y = 700;
    }
  } else if (currentStage == 2) {
    if (killz == 1) {
      stage = "finish";
      killz = 0;
      player.x = 0;
      player.y = 700;
    }
  }
}

// creates the bullets based on the parameters passed through when SPACE is pressed
function bulletManager(x, y, xspeed, yspeed) {
  let bullet = {
    x: x,
    y: y,
    w: 5,
    h: 5,
    xspeed: xspeed,
    yspeed: yspeed,
    damage: 1,
  };
  // pushes bullet into array
  bullets.push(bullet);
}

// creates the enemies based on the parameters passed through currentEnemies is called and they are set to the currenStages enemies
function enemyManager(x, y, speed, damage, health, type, w, h) {
  console.log("enemy created");
  let enemy = {
    x: x,
    y: y,
    w: w,
    h: h,
    speed: speed,
    damage: damage,
    health: health,
    type: type,
  };
  // pushes the enemy to the array
  enemies.push(enemy);
}

// empty arrays for when the enemies and bullets get pushes
let enemies = [];

let bullets = [];

// menu platforms
let menu = [
  { x: 100, y: 100, w: 100, h: 100, Start: true },
  { x: 600, y: 100, w: 100, h: 100, Continue: true },
];

// map platforms
let map = [
  { x: 3000, y: 0, w: 1, h: 940 },
  { x: 300, y: 0, w: 30, h: 440 },
  { x: 500, y: 200, w: 100, h: 100, Level: true, LevelNum: 1 },
  { x: 700, y: 200, w: 100, h: 100, Level: true, LevelNum: 2 },
];

// Platforms for level 1
let levelPlatforms1 = [
  { x: 3100, y: 0, w: 5, h: 940 },
  { x: 200, y: 600, w: 100, h: 20 },
  { x: 400, y: 500, w: 100, h: 20 },
  { x: 550, y: 550, w: 100, h: 20 },
  { x: 800, y: 500, w: 100, h: 20 },
  { x: 950, y: 400, w: 100, h: 20 },
  { x: 1100, y: 300, w: 100, h: 20 },
  { x: 1500, y: 550, w: 100, h: 20 },
  { x: 1600, y: 400, w: 100, h: 20 },
  { x: 1800, y: 500, w: 100, h: 20 },
  { x: 1900, y: 300, w: 100, h: 20 },
  { x: 2000, y: 250, w: 100, h: 20 },
  { x: 2200, y: 200, w: 100, h: 20 },
  { x: 2300, y: 300, w: 100, h: 20 },
  { x: 2500, y: 300, w: 100, h: 20 },
  { x: 2600, y: 250, w: 100, h: 20 },
  { x: 2800, y: 400, w: 100, h: 20 },
  { x: 3000, y: 200, w: 100, h: 20, finish: true },
  { x: 800, y: 735, w: 1000, h: 5, lava: true },
  { x: 2000, y: 735, w: 1000, h: 5, lava: true },
];

// Platforms for level 2
let levelPlatforms2 = [
  { x: 200, y: 650, w: 100, h: 20 },
  { x: 400, y: 500, w: 100, h: 20 },
  { x: 600, y: 400, w: 100, h: 20 },
  { x: 950, y: 500, w: 100, h: 20 },
  { x: 700, y: 300, w: 100, h: 20 },
  { x: 500, y: 735, w: 1000, h: 5, lava: true },
  { x: 1000, y: 200, w: 100, h: 20 },
  { x: 1200, y: 400, w: 100, h: 20 },
  { x: 1300, y: 300, w: 100, h: 20 },
  { x: 1375, y: 500, w: 100, h: 20 },
  { x: 1500, y: 100, w: 100, h: 20 },
  { x: 2000, y: 735, w: 1000, h: 5, lava: true },
  { x: 2000, y: 350, w: 100, h: 20 },
  { x: 2200, y: 550, w: 100, h: 20 },
  { x: 2400, y: 400, w: 100, h: 20 },
  { x: 2600, y: 250, w: 100, h: 20 },
  { x: 2800, y: 300, w: 100, h: 20 },
  { x: 3000, y: 200, w: 100, h: 20 },
  { x: 3200, y: 400, w: 100, h: 20 },
  { x: 3400, y: 500, w: 100, h: 20 },
  { x: 3600, y: 350, w: 100, h: 20 },
  { x: 3800, y: 200, w: 100, h: 20 },
  { x: 3900, y: 450, w: 100, h: 20 },
  { x: 4000, y: 600, w: 100, h: 20 },
  { x: 4300, y: 300, w: 100, h: 20 },
  { x: 5400, y: 700, w: 100, h: 20, finish: true },
  { x: 5500, y: 0, w: 5, h: 940 },
];
