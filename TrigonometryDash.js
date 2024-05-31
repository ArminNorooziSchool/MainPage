// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let view = document.getElementById("my-view");
let viewctx = view.getContext("2d");
let ctx = cnv.getContext("2d");
cnv.hidden = true;

cnv.width = 8000;
cnv.height = 740;
view.width = 1200;
view.height = 740;

// Global Variables
let checkpoints = [];
let isGameStarted = false;
let stage = "title";
let timer = 0;
let deathCounter = 0;
let currentStage = 0;
let currentPlatforms = [];
let levelselection = 0;
let killz = 0;
let levelsComplete = 0;
let firsttimeComplete1 = true;
let firsttimeComplete2 = true;
let movementIntervalBoss = 100;

// Start button click event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    deathCounter = 0;
    timer = 0;
    requestAnimationFrame(draw);
  }
}

// Reset button click event listener that resets the current level
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);

function resetGame() {
  if (isGameStarted == true) {
    if (stage == "level") {
      timer = 0;
      killz = 0;
      player.x = 0;
      player.y = 700;
      player.health = 300;
      healthbar.w = 300;
      enemies = [];
      currentEnemy();
    }
  }
}

// Menu button click event listener that takes you back to the selection stage
let menuButton = document.getElementById("menuButton");
menuButton.addEventListener("click", menuGame);

function menuGame() {
  if (stage == "level" || stage == "selector") {
    timer = 0;
    killz = 0;
    player.x = 0;
    player.y = 700;
    player.health = 300;
    healthbar.w = 300;
    enemies = [];
    stage = "selector";
  }
}

// depending on the current stage call specific functions that will load on that stage and actualize it
function gameStage() {
  if (stage == "title") {
    titleStage();
  } else if (stage == "selector") {
    selectorStage();
  } else if (stage == "level") {
    levelStage();
    timer++;
  } else if (stage == "death") {
    death();
  } else if (stage == "finish") {
    finish();
  }
}

// if player is in menu then call the movePlayer function to allow player to move, also sets currentplatforms to menu
function titleStage() {
  player.jumping = false;
  player.gravity = 0;
  movePlayer();
  currentPlatforms = menu;
  cnv.width = 1200;
}

// if player is in selection map then call the movePlayer function to allow player to move, also sets currentplatforms to map, increases cnv.width
function selectorStage() {
  player.jumping = false;
  player.gravity = 0;
  movePlayer();
  currentPlatforms = map;
  cnv.width = 8000;
}

// if player is in any level then call the movePlayer function to allow player to move, also sets currentplatforms to the current level, increases cnv.width
// and calls other functions needed for levels to work
function levelStage() {
  // set gravity
  player.gravity = 0.3;
  movePlayer();
  cnv.width = 8000;

  // make bullets move and delete when off the view
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].x = bullets[i].x + bullets[i].xspeed;
    bullets[i].y = bullets[i].y + bullets[i].yspeed;
    if (
      bullets[i].x > view.x + view.width ||
      bullets[i].x < view.x ||
      bullets[i].y < 0 ||
      bullets[i].y > 750
    ) {
      bullets.splice(i, 1);
    }
  }

  // make enemies move towards the player if within the view and will move left, right, up and down based on position around the player
  for (let i = 0; i < enemies.length; i++) {
    if (
      enemies[i].x - enemies[i].w <= view.x + view.width &&
      enemies[i].x + enemies[i].w >= view.x
    ) {
      if (enemies[i].type == "melee") {
        if (enemies[i].x < player.x) {
          enemies[i].x = enemies[i].x + enemies[i].speed;
        } else {
          enemies[i].x = enemies[i].x - enemies[i].speed;
        }

        if (enemies[i].y > player.y) {
          enemies[i].y -= 4;
        }
        // boss gets special code allowing it to move slowly at all times, but every 1.667 seconds it can dash towards player, which stops after 2 seconds
      } else if (enemies[i].type == "bossLvl2") {
        if (enemies[i].x < player.x) {
          enemies[i].x = enemies[i].x + 1;
        } else {
          enemies[i].x = enemies[i].x - 1;
        }
        if (enemies[i].y > player.y) {
          enemies[i].y -= 3.5;
        }

        if (timer > movementIntervalBoss) {
          if (enemies[i].x < player.x) {
            enemies[i].x = enemies[i].x + enemies[i].speed;
          } else {
            enemies[i].x = enemies[i].x - enemies[i].speed;
          }
          if (enemies[i].y + enemies[i].h > player.y) {
            enemies[i].y -= 1;
          }
          // will allow 2 seconds of dash before the dash is stopped
          setTimeout(() => {
            movementIntervalBoss = timer + 100;
          }, 2000);
        }
      }
    }
  }
}

// if player is killed then ask them to play again, resets some of the needed variables for the level to reset
function death() {
  if (confirm(`Would you like to play level again?`)) {
    stage = "level";
    killz = 0;
    player.health = 300;
    healthbar.w = 300;
    enemies = [];
    currentEnemy();
    player.x = 0;
    player.y = 400;
    timer = 0;
  }
}

// if player completes the level, check if it's the first time, if true add to levels complete, else do not, will set you back to the selection stage
function finish() {
  if (firsttimeComplete1 == true && levelselection == 1) {
    levelsComplete++;
    firsttimeComplete1 = false;
  } else if (firsttimeComplete2 == true && levelselection == 2) {
    levelsComplete++;
    firsttimeComplete2 = false;
  }
  setTimeout(() => {
    stage = "selector";
    player.x = 50;
    player.y = 400;
  }, 3000);
}

let lastFrameTime = 0;
const targetFPS = 120;
const targetFrameTime = 1000 / targetFPS;

// Program Loop
function draw(currentTime) {
  // Calculate the time difference between the current and last frame
  const deltaTime = currentTime - lastFrameTime;

  // Only update and render the game if enough time has passed
  if (deltaTime >= targetFrameTime) {
    lastFrameTime = currentTime;

    // Call Images
    let Level1Back = document.createElement("img");
    Level1Back.src = "img/Lvl1Back.jpg";
    let normalPlatform = document.createElement("img");
    normalPlatform.src = "img/Grass.png";
    let lavaPlatform = document.createElement("img");
    lavaPlatform.src = "img/lava.png";
    let finishPlatform = document.createElement("img");
    finishPlatform.src = "img/Yellow.png";
    let enemyImage = document.createElement("img");
    enemyImage.src = "img/Mace.png";
    let playerImage = document.createElement("img");
    playerImage.src = "img/playerImage.png";

    // Call game function to start the game and dictate what stage we are in, also have the view follow the player
    gameStage();
    view.x = player.x - 585;

    // Logic
    if (isGameStarted) {
      // Call my collision functions
      platformCollision();
      enemyCollision();

      // Player can jump off ground
      if (player.y + player.h === cnv.height) {
        player.jumping = false;
      }
    }

    // Clear the previous frame
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    viewctx.clearRect(0, 0, view.width, view.height);

    // Draw player
    ctx.fillStyle = "DarkOrange";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    viewctx.fillStyle = "DarkOrange";
    viewctx.fillRect(player.x - view.x, player.y, player.w, player.h);

    // Draw the different platform types with different colors
    for (let i = 0; i < currentPlatforms.length; i++) {
      let platform = currentPlatforms[i];

      if (platform.Start) {
        ctx.fillStyle = "BlueViolet";
        viewctx.fillStyle = "BlueViolet";
      } else if (platform.Continue) {
        ctx.fillStyle = "lime";
        viewctx.fillStyle = "lime";
      } else {
        ctx.fillStyle = "aqua";
        viewctx.fillStyle = "aqua";
      }

      ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
      viewctx.fillRect(platform.x - view.x, platform.y, platform.w, platform.h);
    }

    // If player is in level run this logic
    if (stage == "level") {
      // if level 1 then...
      if (currentStage == 1) {
        viewctx.drawImage(Level1Back, 0, 0, 1200, 870);
      }

      // background of the healthbar color
      viewctx.fillStyle = "red";
      viewctx.fillRect(
        backhealthbar.x,
        backhealthbar.y,
        backhealthbar.w,
        backhealthbar.h
      );

      // foreground of the healthbar color
      viewctx.fillStyle = "green";
      viewctx.fillRect(healthbar.x, healthbar.y, healthbar.w, healthbar.h);

      // initialize timer
      viewctx.font = "20px Consolas";
      viewctx.fillStyle = "orange";
      viewctx.fillText(
        "Time: " + (timer / 60).toFixed(3) + " Seconds",
        150,
        20
      );

      // Draw Platforms based on current stage and what type of platform, also load the images using drawImage()
      for (let i = 0; i < currentPlatforms.length; i++) {
        let platform = currentPlatforms[i];

        viewctx.fillStyle = "aqua";

        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        viewctx.fillRect(
          platform.x - view.x,
          platform.y,
          platform.w,
          platform.h
        );

        if (platform.lava) {
          viewctx.drawImage(
            lavaPlatform,
            currentPlatforms[i].x - view.x,
            currentPlatforms[i].y,
            currentPlatforms[i].w,
            currentPlatforms[i].h + 30
          );
        } else if (platform.finish) {
          viewctx.drawImage(
            finishPlatform,
            currentPlatforms[i].x - view.x,
            currentPlatforms[i].y,
            currentPlatforms[i].w,
            currentPlatforms[i].h
          );
        } else {
          viewctx.drawImage(
            normalPlatform,
            currentPlatforms[i].x - view.x,
            currentPlatforms[i].y,
            currentPlatforms[i].w,
            currentPlatforms[i].h
          );
        }
      }

      // draw enemies and their image
      for (let i = 0; i < enemies.length; i++) {
        let enemi = enemies[i];

        viewctx.fillStyle = "red";

        viewctx.fillRect(enemi.x - view.x, enemi.y, enemi.w, enemi.h);

        viewctx.drawImage(
          enemyImage,
          enemi.x - view.x - 10,
          enemi.y - 5,
          enemi.w + 15,
          enemi.h + 12
        );
      }
      // draw bullets
      viewctx.fillStyle = "red";
      for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
        viewctx.fillRect(
          bullets[i].x - view.x,
          bullets[i].y,
          bullets[i].w,
          bullets[i].h
        );
      }

      // load player image
      viewctx.drawImage(
        playerImage,
        player.x - view.x - 10,
        player.y - 10,
        player.w + 15,
        player.h + 12
      );
    }

    // Draw End Screen upon death
    if (stage == "death") {
      viewctx.font = "60px Consolas";
      viewctx.fillStyle = "green";
      viewctx.fillText("You Died", 300, 200);
    }

    // draw end screen upon level completion
    if (stage == "finish") {
      console.log("works");
      viewctx.font = "60px Consolas";
      viewctx.fillStyle = "green";
      viewctx.fillText("Congratulations!", 300, 300);
      viewctx.fillText(`You beat level ${levelselection}!`, 300, 400);
      viewctx.fillText(
        "Time: " + (timer / 60).toFixed(3) + " Seconds",
        300,
        600
      );
    }

    // request another frame
    requestAnimationFrame(draw);
  }
}
