// Helicopter Game Start

// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

// Global Variables
let heliImg = document.createElement("img");
heliImg.src = "img/heliBlueTransparent.png";

let explosion = document.createElement("audio");
explosion.src = "sound/explosion.wav";

let propeller = document.createElement("audio");
propeller.src = "sound/propeller.wav";

let mouseIsPressed = false;

let state;
let heli;
let wall1, wall2, wall3;

let currentScore = 0;
let highScore = 0;
reset();

// Timing Variables
let lastFrameTime = 0;
const targetFPS = 60;
const frameRate = 1000 / targetFPS; // 60 fps

// Start Game Loop
requestAnimationFrame(gameLoop);

// Game Loop
function gameLoop(currentTime) {
  // Calculate elapsed time since the last frame
  const deltaTime = currentTime - lastFrameTime;

  // Only update and render if enough time has elapsed
  if (deltaTime >= frameRate) {
    update();
    render();

    lastFrameTime = currentTime - (deltaTime % frameRate);
  }

  function update() {
    if (state === "gameon") {
      moveHeli();
      moveWalls();
      checkCollisions();
    }
  }

  function render() {
    if (state === "start") {
      drawStart();
    } else if (state === "gameon") {
      drawGame();
    } else if (state === "gameover") {
      drawGameOver();
    }
  }
  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Event Listeners
cnv.addEventListener("mousedown", function () {
  mouseIsPressed = true;
  propeller.currentTime = 0;
  propeller.play();

  if (state === "start") {
    state = "gameon";
  } else if (state === "gameover") {
    state = "start";
  }
});

cnv.addEventListener("mouseup", function () {
  mouseIsPressed = false;
  propeller.pause();
});
