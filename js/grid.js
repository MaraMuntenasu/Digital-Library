function drawGrid(ctx, grid, cellSize, path, start, finish, shelves) {
    const rows = grid.length;
    const cols = grid[0].length;
  
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Draw grid cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
  
        ctx.fillStyle = grid[r][c] === 1 ? 'black' : 'white';
        ctx.fillRect(x, y, cellSize, cellSize);
  
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  
    // Draw path
    if (path) {
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const [r, c] = path[i];
        const x = c * cellSize + cellSize / 2;
        const y = r * cellSize + cellSize / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  
    // Draw start node
    if (start) {
      const [r, c] = start;
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.2, 0, 2 * Math.PI);
      ctx.fill();
    }
  
    // Draw finish node
    if (finish) {
      const [r, c] = finish;
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      ctx.fillStyle = 'purple';
      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.2, 0, 2 * Math.PI);
      ctx.fill();
    }
  
    // Draw shelves with labels and visit order
    for (let i = 0; i < shelves.length; i++) {
      const [r, c] = shelves[i];
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
  
      // Red circle
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.2, 0, 2 * Math.PI);
      ctx.fill();
        
      ctx.textAlign = 'center';

      // "Document n" label above number
      ctx.fillStyle = 'red';
      ctx.font = `${cellSize * 0.15}px sans-serif`;
      ctx.textBaseline = 'bottom';
      ctx.fillText(`Document ${i + 1}`, x, y - cellSize * 0.25);
    }
  }
  