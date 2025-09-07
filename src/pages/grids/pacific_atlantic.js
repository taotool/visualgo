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
  let p = true; // Left edge (Pacific)
  for (let i = 0; i < rows; i++) {dfs(i, 0, pacific, -1);}
  p = false;// Right edge (Atlantic)
  for (let i = 0; i < rows; i++) {dfs(i, cols - 1, atlantic, -1); }
  p = true;// Top edge (Pacific)
  for (let j = 0; j < cols; j++) {dfs(0, j, pacific, -1); }
  p = false;// Bottom edge (Atlantic)
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

    const dataIn = [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ];
    const dataIn2 = [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [7, 8, 1, 4, 5],
        [5, 1, 1, 2, 4],
    ];
    export function getAlgorithms () {
        return [
            {id: "a",
            name: "Case 1",
            params: [dataIn],
            code: code,
            fn: "pacificAtlantic(fn.params[0])"
            },
            {
                id: "b",
                name: "Case 2",
                code: code,
                params: [dataIn2],
                fn: "pacificAtlantic(fn.params[0])"
            }
        ];

    }
