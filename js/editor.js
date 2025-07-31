let grid = [];
let gridSize = 6;
let fixedCanvasSize = 600; // default fallback
let cellSize = fixedCanvasSize / gridSize;  // dynamic cell size
let start = null;
let finish = null;
let shelves = [];

const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');


function createGrid() {
    gridSize = parseInt(document.getElementById("gridSizeInput").value);
    if (gridSize < 1) return alert("Grid size must be at least 1");
  
    const canvasContainer = canvas.parentElement;
    fixedCanvasSize = canvasContainer.clientWidth;
  
    canvas.width = canvas.height = fixedCanvasSize;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
  
    cellSize = fixedCanvasSize / gridSize;
  
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    start = null;
    finish = null;
    shelves = [];
  
    drawEditorGrid();
  }
  
  

function drawEditorGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = grid[r][c];
      if (cell === 1) ctx.fillStyle = "black"; // wall
      else ctx.fillStyle = "white";
      
      ctx.strokeStyle = '#ccc';
      ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
    }
  }

  // Draw special points
  if (start) drawCell(start[0], start[1], "green");
  if (finish) drawCell(finish[0], finish[1], "purple");
  shelves.forEach(([r, c]) => drawCell(r, c, "red"));
}

function drawCell(row, col, color) {
  ctx.fillStyle = color;
  ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

// Mouse interaction
canvas.addEventListener('contextmenu', e => e.preventDefault()); // disable right-click menu

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
  
    if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return;
  
    if (e.button === 0) {
      // Left click: toggle wall
      grid[y][x] = grid[y][x] === 1 ? 0 : 1;
    } else if (e.button === 2) {
      // Right click: cycle cell role
      const pos = [y, x];
      
      if (!start) {
        start = pos;
      } else if (!finish) {
        finish = pos;
      } else {
        // Check if already a shelf
        const isShelf = shelves.some(s => s[0] === y && s[1] === x);
        
        if (!isShelf) {
          if (shelves.length >= 7) {
            alert("You cannot add more than 7 shelves.");
            return;  // prevent adding
          }
          shelves.push(pos);
        } else {
          // Remove shelf if clicked again
          shelves = shelves.filter(s => s[0] !== y || s[1] !== x);
          if (arraysEqual(start, pos)) start = null;
          if (arraysEqual(finish, pos)) finish = null;
        }
      }
    }
  
    drawEditorGrid();
  });
  
function arraysEqual(a, b) {
  return a && b && a.length === b.length && a.every((v, i) => v === b[i]);
}

function exportGrid() {
  if (!start || !finish) {
    alert("Please define both start and finish points.");
    return;
  }

  const config = {
    grid,
    start,
    finish,
    shelves,
  };

  localStorage.setItem("robotGridConfig", JSON.stringify(config));
  location.href = "results.html";
}
