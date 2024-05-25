// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

// Global Variables
let checkpoints = [];
let isGameStarted = false;
let isGameFinished = false;
let timer = 0;
let deathCounter = 0;
let currentStage = 0;
let currentPlatforms = [];

// Start button click event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    deathCounter = 0;
    timer = 0;
    currentStage = 0;
    nextStage();
    requestAnimationFrame(draw);
  }
}

// Reset button click event listener
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);

function resetGame() {
  if (isGameStarted == true) {
    deathCounter = 0;
    timer = 0;
    currentStage = 0;
    nextStage();
    player = {
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
  } else if (!isGameStarted == true) {
    isGameStarted = true;
    deathCounter = 0;
    timer = 0;
    currentStage = 0;
    nextStage();
    player = {
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
  }
}

// Program Loop
function draw() {
  // Logic
  if (isGameStarted) {
    timer++;
    movePlayer();
    platformCollision();
    // If collision with ground/top, player jump
    if (player.y + player.h === cnv.height) {
      player.jumping = false;
    }
  }

  // Drawing
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // Draw player
  ctx.fillStyle = "DarkOrange";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Draw Platforms based on type and current stage
  for (let i = 0; i < currentPlatforms.length; i++) {
    let platform = currentPlatforms[i];

    if (platform.teleport) {
      ctx.fillStyle = "BlueViolet";
    } else if (platform.checkpoint) {
      ctx.fillStyle = "Gold";
    } else if (platform.lava) {
      ctx.fillStyle = "Crimson";
    } else if (platform.spring) {
      ctx.fillStyle = "lime";
    } else if (platform.shrink) {
      ctx.fillStyle = "blue";
    } else if (platform.grow) {
      ctx.fillStyle = "red";
    } else if (platform.normal) {
      ctx.fillstyle = "white";
    } else if (platform.slow) {
      ctx.fillstyle = "red";
    } else if (platform.speed) {
      ctx.fillstyle = "red";
    } else {
      ctx.fillStyle = "aqua";
    }

    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

    ctx.font = "20px Consolas";
    ctx.fillStyle = "lightblue";
    ctx.fillText("Time: " + (timer / 60).toFixed(3) + " Seconds", 150, 20);
    ctx.fillText("Deaths: " + deathCounter, 600, 20);
    ctx.fillText("Level: " + currentStage, 500, 20);
  }

  // Draw End Screen
  if (!isGameStarted) {
    ctx.font = "60px Consolas";
    ctx.fillStyle = "green";
    ctx.fillText("Congratulations!", 120, 200);
    ctx.fillText("Deaths: " + deathCounter, 120, 300);
    ctx.fillText("Time: " + (timer / 60).toFixed(3) + " Seconds", 120, 400);
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }

  // request another frame
  requestAnimationFrame(draw);
}
