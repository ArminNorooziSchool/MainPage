// FUNCTIONS

// Draw Start Screen
function drawStart() {
  drawMainComponenets();
  // Start Text
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("CLICK TO START", 350, 285);

  ctx.font = "25px Consolas";
  ctx.fillText("CLICK AND HOLD LEFT MOUSE BUTTON TO GO UP", 100, 450);
  ctx.fillText("RELEASE TO GO DOWN", 415, 480);

  ctx.font = "30px Consolas";
  ctx.fillStyle = "black";
  ctx.fillText("Distance: " + currentScore, 25, cnv.height - 15);
  ctx.fillText("Best: " + highScore, cnv.width - 250, cnv.height - 15);
}

// Draw Game Elements
function runGame() {
  moveHeli();

  moveWalls();

  checkCollisions();

  drawGame();
}

function moveHeli() {
  // Accel Up
  if (mouseIsPressed) {
    heli.speed += -1;
  }

  // Apply Grav Accel
  heli.speed += heli.accel;

  // Constrain Speed
  if (heli.speed > 5) {
    heli.speed = 5;
  } else if (heli.speed < -5) {
    heli.speed = -5;
  }

  // Move Helicopter
  heli.y += heli.speed;
}

function moveWalls() {
  // Wall 1
  wall1.x += -3;
  if (wall1.x + wall1.w < 0) {
    wall1.x = wall3.x + 500;
    wall1.y = Math.random() * 300 + 100;
  }
  // Wall 2
  wall2.x += -3;
  if (wall2.x + wall2.w < 0) {
    wall2.x = wall1.x + 500;
    wall2.y = Math.random() * 300 + 100;
  }
  // Wall 3
  wall3.x += -3;
  if (wall3.x + wall3.w < 0) {
    wall3.x = wall2.x + 500;
    wall3.y = Math.random() * 300 + 100;
  }

  // Wall Pass
  if (wall1.x + wall1.w < heli.x && !wall1.passed) {
    wall1.passed = true;
    currentScore++;
    wall2.passed = false;
  }
  if (wall2.x + wall2.w < heli.x && !wall2.passed) {
    wall2.passed = true;
    currentScore++;
    wall3.passed = false;
  }
  if (wall3.x + wall3.w < heli.x && !wall3.passed) {
    wall3.passed = true;
    currentScore++;
    wall1.passed = false;
  }
}

function checkCollisions() {
  // Collision with Top and Bottom
  if (heli.y < 50 || heli.y + heli.h > cnv.height - 50) {
    gameOver();
  }

  // Collisions with Walls
  if (
    heli.x < wall1.x + wall1.w &&
    heli.x + heli.w > wall1.x &&
    heli.y < wall1.y + wall1.h &&
    heli.y + heli.h > wall1.y
  ) {
    gameOver();
  }

  if (
    heli.x < wall2.x + wall2.w &&
    heli.x + heli.w > wall2.x &&
    heli.y < wall2.y + wall2.h &&
    heli.y + heli.h > wall2.y
  ) {
    gameOver();
  }

  if (
    heli.x < wall3.x + wall3.w &&
    heli.x + heli.w > wall3.x &&
    heli.y < wall3.y + wall3.h &&
    heli.y + heli.h > wall3.y
  ) {
    gameOver();
  }
}

function gameOver() {
  explosion.play();
  state = "gameover";
  setTimeout(reset, 1000);
  // Update high score
  if (currentScore > highScore) {
    highScore = currentScore;
  }
}

function drawGame() {
  drawMainComponenets();
  drawWalls();
}

// Draw Game Over Screen
function drawGameOver() {
  drawMainComponenets();
  drawWalls();

  // Circle around Helicopter
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(heli.x + heli.w / 2, heli.y + heli.h / 2, 60, 0, 2 * Math.PI);
  ctx.stroke();

  // Game Over Text
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("GAME OVER", 350, 285);
}

// Helper Functions

function reset() {
  state = "start";

  heli = {
    x: 200,
    y: 250,
    w: 80,
    h: 40,
    speed: 0,
    accel: 0.7,
  };

  wall1 = {
    x: cnv.width,
    y: Math.random() * 300 + 100,
    w: 50,
    h: 100,
  };

  wall2 = {
    x: cnv.width + 500,
    y: Math.random() * 300 + 100,
    w: 50,
    h: 100,
  };

  wall3 = {
    x: cnv.width + 1000,
    y: Math.random() * 300 + 100,
    w: 50,
    h: 100,
  };

  currentScore = 0;
}

function drawWalls() {
  ctx.fillStyle = "green";
  ctx.fillRect(wall1.x, wall1.y, wall1.w, wall1.h);
  ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);
  ctx.fillRect(wall3.x, wall3.y, wall3.w, wall3.h);
}

function drawMainComponenets() {
  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // Green Bars
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, cnv.width, 50);
  ctx.fillRect(0, cnv.height - 50, cnv.width, 50);

  // Green Bar Text
  ctx.font = "30px Consolas";
  ctx.fillStyle = "black";
  ctx.fillText("HELICOPTER GAME", 25, 35);
  ctx.fillText("Distance: " + currentScore, 25, cnv.height - 15);
  ctx.fillText("Best: " + highScore, cnv.width - 250, cnv.height - 15);

  // Helicopter
  ctx.drawImage(heliImg, heli.x, heli.y);
}
