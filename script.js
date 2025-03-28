const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rows = 60;
const cols = 60;
const cellSize = 10;
let grid = createGrid();
let running = false;
let interval;

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  grid[y][x] = grid[y][x] ? 0 : 1;
  drawGrid();
});

function createGrid() {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = grid[y][x] ? "#333" : "#fff";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function nextGeneration() {
  const newGrid = createGrid();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(x, y);
      if (grid[y][x]) {
        newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        newGrid[y][x] = neighbors === 3 ? 1 : 0;
      }
    }
  }

  grid = newGrid;
  drawGrid();
}

function countNeighbors(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const nx = x + j;
      const ny = y + i;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

function start() {
  if (!running) {
    running = true;
    interval = setInterval(nextGeneration, 100);
  }
}

function pause() {
  running = false;
  clearInterval(interval);
}

function randomize() {
  grid = grid.map(row => row.map(() => (Math.random() > 0.7 ? 1 : 0)));
  drawGrid();
}

function clearGrid() {
  grid = createGrid();
  drawGrid();
}

drawGrid();
