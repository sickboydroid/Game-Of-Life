const gameGrid = document.querySelector("#game-grid");
const btnStartStop = document.querySelector("#start-stop");
const btnClear = document.querySelector("#clear");
const rangeSpeed = document.querySelector("#speed-range");
const labelSpeed = document.querySelector("#speed-label");
const CELL_SIZE_PIXELS = 15;
const ALIVE_CELL_COLOR = "black";
const DEAD_CELL_COLOR = "white";

let isDrag = false;
let play = false;
let gameGridDivs = [];
let ROWS;
let COLS;

resetGameGrid();
gameGrid.addEventListener("mouseleave", () => (isDrag = false));
rangeSpeed.addEventListener(
  "input",
  () => (labelSpeed.textContent = rangeSpeed.value + "x")
);
btnClear.addEventListener("click", () => resetGameGrid());
btnStartStop.addEventListener("click", function () {
  play = !play;
  if (play) {
    playGame();
    btnStartStop.textContent = "Stop";
  } else {
    btnStartStop.textContent = "Start";
  }
});

function playGame() {
  nextGeneration();
  if (play) setTimeout(playGame, 500 * (1 / rangeSpeed.value));
}

function nextGeneration() {
  const changes = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const neighbors = getAliveNeighbors(r, c);
      if ((neighbors < 2 || neighbors > 3) && isAlive(r, c)) changes.push([r, c]);
      else if (neighbors === 3 && isDead(r, c)) changes.push([r, c]);
    }
  }

  // commit changes
  for (const change of changes) {
    toggleCell(...change);
  }
}

function getAliveNeighbors(r, c) {
  let count = 0;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  for (const [dr, dc] of dirs) {
    const [nr, nc] = [r + dr, c + dc];
    if (0 <= nr && nr < ROWS && 0 <= nc && nc < COLS) {
      if (isAlive(nr, nc)) count++;
    }
  }
  return count;
}

function resetGameGrid(cellSizePixels = CELL_SIZE_PIXELS) {
  const gridWidth = gameGrid.offsetWidth;
  const gridHeight = gameGrid.offsetHeight;
  ROWS = Math.floor(gridHeight / cellSizePixels);
  COLS = Math.floor(gridWidth / cellSizePixels);
  gameGridDivs = Array(ROWS)
    .fill()
    .map(e => Array(COLS));

  [...gameGrid.children].forEach(child => child.remove());

  gameGrid.style["grid-template-columns"] = `repeat(${COLS}, ${cellSizePixels}px)`;
  gameGrid.style["grid-template-rows"] = `repeat(${ROWS}, ${cellSizePixels}px)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.addEventListener("mousedown", () => (isDrag = true));
      cell.addEventListener("mouseup", () => (isDrag = false));
      cell.addEventListener("mouseover", () => onCellHovered(r, c));
      cell.addEventListener("click", () => toggleCell(r, c));
      gameGridDivs[r][c] = cell;
      gameGrid.appendChild(cell);
    }
  }
}

function isAlive(r, c) {
  return getCellColor(r, c) === ALIVE_CELL_COLOR;
}

function isDead(r, c) {
  return !isAlive(r, c);
}

function getCellColor(r, c) {
  return gameGridDivs[r][c].style["background-color"];
}

function makeAlive(r, c) {
  setCellColor(r, c, ALIVE_CELL_COLOR);
}

function makeDead(r, c) {
  setCellColor(r, c, DEAD_CELL_COLOR);
}

function toggleCell(r, c) {
  if (isAlive(r, c)) makeDead(r, c);
  else makeAlive(r, c);
}
function setCellColor(r, c, color) {
  gameGridDivs[r][c].style["background-color"] = color;
}

function onCellHovered(r, c) {
  if (isDrag) makeAlive(r, c);
}
