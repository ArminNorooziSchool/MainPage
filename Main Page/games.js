// Declare canvas
let cnv = document.getElementById("main-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 2000;

// 2d Array to store all the game data
let allGames = [
  ["Trigonometric Moments", "img/geoThumb.png", "geo.html"],
  ["Flappy Copter", "img/heliBlueTransparent.png", "flappy.html"],
  ["Trigonometry Dash", "img/playerimage.png", "TrigonometryDash.html"],
  ["Trigonometric Moments 2", "img/geoThumb2.png", "geo2.html"],
  ["Game 5", "image5.png", "https://example.com/game5"],
  ["Game 6", "image6.png", "https://example.com/game6"],
];

// Draw Function to draw all the games
function renderAllGames() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // Title at the top
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("All Games", 350, 30);

  // create squares for each game, each having a specified size
  allGames.forEach((game, index) => {
    let x = 200;
    let y = index * 300 + 80;
    let squareSize = 250;

    // load the image
    let image = new Image();
    image.src = game[1];

    // draw the image on load using the parameters
    image.onload = function () {
      ctx.drawImage(image, x, y, squareSize, squareSize);

      // Draw border around the image
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, squareSize, squareSize);
    };

    // Render the game name text
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(game[0], x + squareSize + 10, y + squareSize / 2);
  });
}

// Call the render function to initially display the games
renderAllGames();

// Add event listener for mouse down
cnv.addEventListener("mousedown", function (event) {
  let rect = cnv.getBoundingClientRect();
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;

  allGames.forEach((game, index) => {
    let x = 200;
    let y = index * 300 + 80;
    let squareSize = 250;

    // Check collision with mouse and game square/cell
    if (
      mouseX >= x &&
      mouseX <= x + squareSize &&
      mouseY >= y &&
      mouseY <= y + squareSize
    ) {
      // when collide grab the website link and open it
      window.open(game[2], "_self");
    }
  });
});

// Search Bar Function
function searchGames() {
  // grab the searched words/letters. and find all game title matches
  let searchTerm = document.getElementById("search-input").value.toLowerCase();
  let filteredGames = allGames.filter((game) =>
    game[0].toLowerCase().includes(searchTerm)
  );

  // reset canvas
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // load the games which fit the criteria
  filteredGames.forEach((game, index) => {
    let x = 200;
    let y = index * 300 + 80;
    let squareSize = 250;

    // load the images
    let image = new Image();
    image.src = game[1];

    // draw the game images using the parameters
    image.onload = function () {
      ctx.drawImage(image, x, y, squareSize, squareSize);

      // Draw border around the image
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, squareSize, squareSize);
    };

    // Render the name of the game
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(game[0], x + squareSize + 10, y + squareSize / 2);
  });
}
