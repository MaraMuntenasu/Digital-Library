let allRuns = [];

window.onload = () => {
  const canvas = document.getElementById('gridCanvas');
  const ctx = canvas.getContext('2d');
  const cellSize = 100;

  const grid = [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 0],
  ];

  const start = [0, 0];
  const finish = [5, 5];
  const shelves = [[0, 1], [0, 3], [3, 1], [3, 3]];

  const permutations = getPermutations(shelves);
  let bestPath = null;
  let bestOrder = null;
  let bestCost = Infinity;

  allRuns = [];

  for (const perm of permutations) {
    let current = start;
    let totalPath = [];
    let totalCost = 0;
    let valid = true;

    for (const shelf of perm) {
      const { path } = astar(grid, current, shelf);
      if (!path) {
        valid = false;
        break;
      }
      totalPath = totalPath.concat(totalPath.length ? path.slice(1) : path);
      totalCost += path.length - 1;
      current = shelf;
    }

    if (!valid) continue;

    const { path: finalPath } = astar(grid, current, finish);
    if (!finalPath) continue;

    totalPath = totalPath.concat(finalPath.slice(1));
    totalCost += finalPath.length - 1;

    allRuns.push({
      order: perm,
      path: totalPath,
      cost: totalCost
    });

    if (totalCost < bestCost) {
      bestCost = totalCost;
      bestPath = totalPath;
      bestOrder = perm;
    }
  }

  drawGrid(ctx, grid, cellSize, bestPath, start, finish, bestOrder);
  updateResults(bestCost, bestOrder, bestPath);
  populatePermutationList(grid, cellSize, ctx, start, finish);
};

function updateResults(cost, order, path) {
  document.getElementById("stepCount").textContent = cost;

  const docList = document.getElementById("documentOrder");
  docList.innerHTML = "";
  order.forEach((doc, i) => {
    const li = document.createElement("li");
    li.textContent = `Document ${i + 1}: (${doc[0]}, ${doc[1]})`;
    docList.appendChild(li);
  });

  document.getElementById("fullPath").textContent =
    `[${path.map(p => `(${p[0]}, ${p[1]})`).join(', ')}]`;
}


function populatePermutationList(grid, cellSize, ctx, start, finish) {
    const permCount = document.getElementById("permCount");
    const permDropdown = document.getElementById("permDropdown");
    const loadBtn = document.getElementById("loadVisualsBtn");
  
    permCount.textContent = allRuns.length;
    permDropdown.innerHTML = "";
  
    allRuns.forEach((run, index) => {
      const option = document.createElement("option");
      option.value = index.toString(); 
      option.textContent = `#${index + 1} — Steps: ${run.cost} — ${run.order.map(p => `(${p[0]},${p[1]})`).join(' → ')}`;
      permDropdown.appendChild(option);
    });
  
    loadBtn.onclick = () => {
      const selectedIndex = permDropdown.value;
      if (selectedIndex !== "") {
        loadPermutation(parseInt(selectedIndex));
        scrollToCanvas();
      }
    };
  }
  

  function loadPermutation(index) {
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 100;
  
    const run = allRuns[index];
  
    const grid = [
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 0],
    ];
    const start = [0, 0];
    const finish = [5, 5];
  
    drawGrid(ctx, grid, cellSize, run.path, start, finish, run.order);
    updateResults(run.cost, run.order, run.path);
  }
  
  function scrollToCanvas() {
    const canvas = document.getElementById("gridCanvas");
    canvas.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  
