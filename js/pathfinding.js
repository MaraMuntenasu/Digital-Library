// Manhattan distance heuristic
function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// A* algorithm
function astar(grid, start, goal) {
    const openSet = new MinHeap();
    openSet.push({ f: heuristic(start, goal), g: 0, pos: start });

    const cameFrom = new Map();
    const gScore = new Map();
    gScore.set(start.toString(), 0);

    const openNodes = new Set();
    const closedNodes = new Set();

    while (!openSet.isEmpty()) {
        const current = openSet.pop();
        const [r, c] = current.pos;

        if (r === goal[0] && c === goal[1]) {
            const path = [current.pos];
            let curr = current.pos.toString();
            while (cameFrom.has(curr)) {
                curr = cameFrom.get(curr);
                path.push(curr.split(',').map(Number));
            }
            return { path: path.reverse(), openNodes, closedNodes };
        }

        closedNodes.add(current.pos.toString());

        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const nr = r + dr;
            const nc = c + dc;
            const neighbor = [nr, nc];

            if (
                nr >= 0 && nr < grid.length &&
                nc >= 0 && nc < grid[0].length &&
                grid[nr][nc] === 0
            ) {
                const neighborKey = neighbor.toString();
                const tentativeG = gScore.get(current.pos.toString()) + 1;

                if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
                    cameFrom.set(neighborKey, current.pos.toString());
                    gScore.set(neighborKey, tentativeG);
                    const f = tentativeG + heuristic(neighbor, goal);
                    openSet.push({ f, g: tentativeG, pos: neighbor });
                    openNodes.add(neighborKey);
                }
            }
        }
    }

    return { path: null, openNodes, closedNodes };
}

//Generates permutations
function getPermutations(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
  
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      const perms = getPermutations(remaining);
      for (const perm of perms) {
        result.push([current].concat(perm));
      }
    }
  
    return result;
  }
  