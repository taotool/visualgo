    const code = `function pacificAtlantic(heights) {
  const result = [];
  const rows = heights.length;
  const cols = heights[0].length;
  //记录所有能到达pacific的位置//从低处往高处走，反过来找到来源。
  const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
  //记录所有能到达atlantic的位置
  const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));
  const res = [];
  const dfs = (row, col, visited, prevHeight) => {
    if (row < 0 || col < 0 || row >= rows || col >= cols || visited[row][col] || heights[row][col] < prevHeight) {
      return;
    }
    visited[row][col] = true;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1],]) {
      dfs(row + dr, col + dc, visited, heights[row][col]);
    }
  };
  // Start DFS from edges
  // Left edge (Pacific)
  for (let i = 0; i < rows; i++) {dfs(i, 0, pacific, -1);}
  
  // Top edge (Pacific)
  for (let j = 0; j < cols; j++) {dfs(0, j, pacific, -1); }
  
  // Right edge (Atlantic)
  for (let i = 0; i < rows; i++) {dfs(i, cols - 1, atlantic, -1); }
  
  // Bottom edge (Atlantic)
  for (let j = 0; j < cols; j++) {dfs(rows - 1, j, atlantic, -1); }
  
  // Collect cells that can flow to both oceans
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (pacific[i][j] && atlantic[i][j]) {
        res.push([i, j]);
      }
    }
  }
  return result;
}
    `;

  function pacificAtlantic(heights) {
    const result = [];
    const rows = heights.length;
    const cols = heights[0].length;
    //从低处往高处走，反过来找到来源。
    //记录所有能到达pacific的位置
    const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
    //记录所有能到达atlantic的位置
    const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));
    const res = [];
    let p = true;
    // DFS helper
    const dfs = (row, col, visited, prevHeight) => {
      if (
        row < 0 ||
        col < 0 ||
        row >= rows ||
        col >= cols ||
        visited[row][col] ||
        heights[row][col] < prevHeight
      ) {
        return;
      }
      result.push({commands:[{ cmd: p?"GRID_PRE_HIGHLIGHT_CELL":"GRID_POST_HIGHLIGHT_CELL", params: [row, col], i:row, j: col}], description: `found a higher place`, result:`${heights[row][col]} >= ${prevHeight}` });
      visited[row][col] = true;
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        dfs(row + dr, col + dc, visited, heights[row][col]);
      }
    };
  
    // Start DFS from edges
    p = true;
    for (let i = 0; i < rows; i++) {
      result.push({commands:[{ cmd: "READ", params: [i, 0], i:i, j: 0}], description: `Left edge (Pacific) [${i}, ${0}]` });
      dfs(i, 0, pacific, -1); // Left edge (Pacific)
    }
  
    p = true;
    for (let j = 0; j < cols; j++) {
      result.push({commands:[{ cmd: "READ", params: [0, j], i:0, j: j}], description: `Top edge (Pacific) [${0}, ${j}]` });
      dfs(0, j, pacific, -1); // Top edge (Pacific)
    }
  
    p = false;
    for (let i = 0; i < rows; i++) {
      result.push({commands:[{ cmd: "READ", params: [i, cols - 1], i:i, j: 0}], description: `Right edge (Atlantic) [${i}, ${cols - 1}]` });
      dfs(i, cols - 1, atlantic, -1); // Right edge (Atlantic)
    }
  
    p = false;
    for (let j = 0; j < cols; j++) {
      result.push({commands:[{ cmd: "READ", params: [rows - 1, j], i:0, j: j}], description: `Bottom edge (Atlantic) [${rows - 1}, ${j}]` });
      dfs(rows - 1, j, atlantic, -1); // Bottom edge (Atlantic)
    }
  
    // Collect cells that can flow to both oceans
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (pacific[i][j] && atlantic[i][j]) {
          result.push({commands:[{ cmd: "GRID_HIGHLIGHT_CELL", params: [i, j], i:i, j: j}], description: `both` });
  
          res.push([i, j]);
        }
      }
    }
  
    return result;
  }
  
    
    const dataIn = [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ];

    export default function anyname() {
        return [
            {id: "a",
            name: "Case 1",
            params: [dataIn],
            init: () => dataIn,
            code: code,
            fn: () => {
              return pacificAtlantic(dataIn);
            }
          }
        ];

    }

    export const queueEnabled = false;
    export const stackEnabled = false;
    export const arrayEnabled = false;