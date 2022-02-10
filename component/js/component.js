/**
 * Tic Tac Toe component.
 * Is responsible for the creation of the board & for handling clicks.
 * Expects two elements declared on the corresponding HTML (Clear & Restart buttons)
 */

// Global Variables
var canvas;
var canvasData;
var canvasContext;
var currentPlayTile;
var filledTileCount;
var createdTileCount;

// Board Constants
const gridRowCount = 3;
const gridColCount = 3;
const startPlayer = "X"; // Valid values here would be X & O
const playerX = "X"; // Alternatively, we could use an enumeration for Player values.
const playerO = "O";
const noPlayer = "B";
const backgroundColor = "#3b3738";
const foregroundColor = "#7E8F7C";

// Size Constants
const baseWidth = 100;
const baseHeight = 100;
const paddedSize = 120;
const basePadding = 20;

// Calculated Constants
const totalTileCount = gridRowCount * gridColCount;

/**
 * On Window Load, Main Function.
 * Creates, initializes & attaches a listener to the 2-Dimensional Canvas board.
 */
window.onload = function() {
  canvas = document.createElement("canvas");
  canvas.width = canvas.height = gridRowCount * paddedSize + basePadding;
  canvasContext = canvas.getContext("2d");
  document.getElementById("appWrapper").appendChild(canvas);
  canvas.addEventListener("mousedown", handleCanvasMouseDown);
  tttInit();
};

/**
 * Event Listener for the Reset ('Clear') Button.
 */
document.getElementById("resetButton").addEventListener("click", event => {
  console.log("resetButton Clicked.");
  tttInit();
});

/**
 * Event Listener for the Restart Button.
 */
document.getElementById("restartButton").addEventListener("click", event => {
  console.log("restartButton Clicked.");
  tttInit();
});

/**
 * Initialize the Tic-Tac-Toe board & tiles.
 * Set the intial values & player.
 */
function tttInit() {
  console.log("tttInit() - Game Initialized.");

  // Toggle visibility on any buttons want to hide
  document.getElementById("restartButton").style.visibility = "hidden";

  // If this is not the first run of the game, clear out the Canvas as a part of initialization
  if (canvasData != null) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  }

  // (Re) Initialize Globals
  canvasData = [];
  filledTileCount = 0;
  createdTileCount = 0;

  // Create the board base - based on the constants specified
  for (let tileIterator = 0; tileIterator < totalTileCount; tileIterator++) {
    let xCoOrd = tileIterator % gridRowCount * paddedSize + basePadding;
    let yCoOrd = Math.floor(tileIterator / gridRowCount) * paddedSize + basePadding;
    canvasData.push(new Tile(xCoOrd, yCoOrd));
  }

  // Determine the initial player
  switch (startPlayer.toUpperCase()) {
    case playerX:
      currentPlayTile = playerX;
      break;
    case playerO:
      currentPlayTile = playerO;
      break;
    default:
      console.warn("tttInit() - Initial Player Defaulted to X. Please Verify Board Constants!");
      currentPlayTile = playerX;
  }

  // Trigger the animation render updates
  tttRequestRenderUpdate();
}

/**
 * Request an animation update before the next re-paint by the browser & draw our Tiles.
 */
function tttRequestRenderUpdate() {
  window.requestAnimationFrame(tttRequestRenderUpdate);
  for (let tileIterator = canvasData.length; tileIterator--; ) {
    canvasData[tileIterator].drawTile(canvasContext);
  }
}

/**
 * Handle clicks inside the Canvas.
 * Reponsibilities:
 * - Determine whether the click is on a Tile.
 * - Determine whether the clicked Tile has been played already.
 * - Provide functionality to play an unclicked Tile.
 * - Provide functionality to indicate end-of-game & allow for a restart.
 */
function handleCanvasMouseDown(mouseDownEvent) {
  let mouseDownEventTarget = mouseDownEvent.target;

  // Horizontal Co-Ordinate
  let xCoOrd = mouseDownEvent.clientX - mouseDownEventTarget.offsetLeft;

  // Vertical Co-Ordinate
  let yCoOrd = mouseDownEvent.clientY - mouseDownEventTarget.offsetTop;

  // Determine whether the mouse click was in the relevant Canvas area
  if (xCoOrd % paddedSize >= basePadding && yCoOrd % paddedSize >= basePadding) {
    let tileIndex = Math.floor(xCoOrd / paddedSize);
    tileIndex += Math.floor(yCoOrd / paddedSize) * gridRowCount;

    // If the tile is not Blank, there's nothing more to do - return.
    if (canvasData[tileIndex].isNotBlank()) {
      console.warn("handleCanvasMouseDown - Tile (" + tileIndex + ") Has Already Been Played!");
      return;
    }

    // Else play it.
    canvasData[tileIndex].playTile(currentPlayTile);
    console.log("handleCanvasMouseDown - Tile (" + tileIndex + ") Played By " + currentPlayTile);
    currentPlayTile = currentPlayTile === playerO ? playerX : playerO;

    // Increment the filled tile count on a successful Tile Click
    filledTileCount++;
    if (filledTileCount === totalTileCount) {
      console.log("handleCanvasMouseDown - Current Game Has Ended.");

      // Enable the 'Play Again' functionality
      document.getElementById("restartButton").style.visibility = "visible";
    }
  } else {
    console.info("handleCanvasMouseDown - Clicked Outside Relevant Area.");
  }
}

/**
 * A class that represents a tile on the board in the game.
 * 
 * Functionality:
 * - Accept X & Y co-ordinates & construct a 'Blank' Tile (Canvas).
 * - Allow (Draw) a Tile to be played for X & O.
 * - Return a state of the Tile.
 */
class Tile {
  /**
   * Construct the Tile with the provided X & Y Co-Ordinates
   * 
   * @param {Number} xCoOrd - The X Co-Ordinate for the Tile
   * @param {Number} yCoOrd - The Y Co-Ordinate for the Tile
   */
  constructor(xCoOrd, yCoOrd) {
    this.xCoOrd = xCoOrd;
    this.yCoOrd = yCoOrd;

    this.canvasLineWidth = 4;
    this.canvasLineCap = "round";

    this.rectXCoOrd = 0;
    this.rectYCoOrd = 0;

    this.circleXCoOrd = 50;
    this.circleYCoOrd = 50;
    this.circleRadiusNumber = 30;
    this.circleStartAngle = 0;
    this.circleEndAngle = 2 * Math.PI;

    this.crossXCoOrd = 20;
    this.crossYCoOrd = 20;
    this.crossXStart = 80;
    this.crossYStart = 80;

    this._canvas = document.createElement("canvas");
    this._canvas.setAttribute("class", "tttCanvas");
    this._canvas.setAttribute("id", "tttCanvas" + createdTileCount);
    this._canvas.width = this._canvas.height = baseHeight;
    createdTileCount++;

    this._canvasContext = this._canvas.getContext("2d");
    this._canvasContext.fillStyle = backgroundColor;
    this._canvasContext.lineWidth = this.canvasLineWidth;
    this._canvasContext.strokeStyle = foregroundColor;
    this._canvasContext.lineCap = this.canvasLineCap;
    this._canvasContext.fillRect(this.rectXCoOrd, this.rectYCoOrd, baseWidth, baseHeight);

    // Default to a Blank Tile
    this.state = noPlayer;
    this.playTile(noPlayer);
  }

  /**
   * Return TRUE if the current Tile is not a Blank Tile, else FALSE.
   */
  isNotBlank() {
    if (this.state !== noPlayer) {
      return true;
    }
    return false;
  }

  /**
   * Return the current state of the Tile (Blank, Cross or Circle).
   */
  getState() {
    return this.state;
  }

  /**
   * Setup the Canvas Context according to the input type of Tile (Blank, Cross or Circle).
   * 
   * @param {String} currentPlayTile 
   */
  playTile(currentPlayTile) {
    if (currentPlayTile === noPlayer) {
      this.state = noPlayer;
      this.img = new Image();
      this.img.src = this._canvas.toDataURL(); // State of the Canvas (DataURL -> Base64 - PNG)
      this._canvasContext.fillRect(this.rectXCoOrd, this.rectYCoOrd, baseWidth, baseHeight);
    } else if (currentPlayTile === playerO) {
      this.state = playerO;
      this._canvasContext.fillRect(this.rectXCoOrd, this.rectYCoOrd, baseWidth, baseHeight);
      this._canvasContext.beginPath(); // Create Base PolyGon
      this._canvasContext.arc(this.circleXCoOrd, this.circleYCoOrd, this.circleRadiusNumber, this.circleStartAngle, this.circleEndAngle); // Create Circle
      this._canvasContext.stroke();
      this.img = new Image();
      this.img.src = this._canvas.toDataURL();
    } else if (currentPlayTile === playerX) {
      this.state = playerX;
      this._canvasContext.fillRect(this.rectXCoOrd, this.rectYCoOrd, baseWidth, baseHeight);
      this._canvasContext.beginPath();
      this._canvasContext.moveTo(this.crossXCoOrd, this.crossYCoOrd);
      this._canvasContext.lineTo(this.crossXStart, this.crossYStart);
      this._canvasContext.moveTo(this.crossXStart, this.crossYCoOrd);
      this._canvasContext.lineTo(this.crossXCoOrd, this.crossYStart);
      this._canvasContext.stroke();
      this.img = new Image();
      this.img.src = this._canvas.toDataURL();
    } else {
      console.log("playTile() - Invalid Argument: " + currentPlayTile);
    }
  }

  /**
   * Draw the image of this Tile onto the Canvas.
   * 
   * @param {CanvasRenderingContext} canvasContext 
   */
  drawTile(canvasContext) {
    canvasContext.drawImage(this.img, this.xCoOrd, this.yCoOrd);
  }
}
