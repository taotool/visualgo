const code = `function numIslandsDFS(gridIn){
  function numIslands(grid) {
      let res = 0;
      for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[0].length; j++) {
              if (grid[i][j] === '1') {
                  dfs(grid, i, j);
                  res++;
              }
          }
      }
      return res;
  }
  function dfs(grid, row, col) {
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;
      if (grid[row][col] === '0') return;
      grid[row][col] = '0';
      dfs(grid, row - 1, col);
      dfs(grid, row + 1, col);
      dfs(grid, row, col - 1);
      dfs(grid, row, col + 1);
  }
  numIslands(gridIn);
}
`;

const dataIn = [
  ["0","1","0","1","1","0"],
  ["0","1","1","0","1","0"],
  ["0","0","0","0","0","0"],
  ["0","1","1","0","0","0"],
  ["0","0","0","1","0","0"],
  ["0","0","0","0","1","1"],
];
export function getAlgorithms () {
    return [
        {id: "a",
        name: "Case 1",
        params: [dataIn],
        code: code,
        fn: "numIslandsDFS(fn.params[0])"
        },
    ];

}
