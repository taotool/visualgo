import clone from 'clone';
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

function numIslandsDFS(gridIn) {
    const result = [];

    function numIslands(grid) {
        let res = 0;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {

                if (grid[i][j] === '1') {
                    result.push({commands:[
                        { cmd: "GRID_HIGHLIGHT_CELL", params: [i, j]},
                        { cmd: "GRID_UPDATE_POINTER", params: ["left1", i, "i="+i]},
                        { cmd: "GRID_UPDATE_POINTER", params: ["top1", j, "j="+j]},
                    ], description: `island ${res + 1}` });
                    dfs(grid, i, j);
                    res++;
                    //result.push({ action: "READ", params: [i, j], i:i, j: j, description: `Found ${res} ${res>1?"islands":"island"}` });

                }
            }
        }
        return res;
    }

    function dfs(grid, row, col) {
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;
        if (grid[row][col] === '0') return;
        grid[row][col] = '0';
        result.push({commands:[
            { cmd: "GRID_UPDATE_CELL", params: [row, col, '0']},
            { cmd: "GRID_POST_HIGHLIGHT_CELL", params: [row, col, '0']},
            { cmd: "GRID_UPDATE_POINTER", params: ["right1", row, "r="+row]},
            { cmd: "GRID_UPDATE_POINTER", params: ["bottom1", col, "c="+col]},
        ], description: `mark it as water` });

        dfs(grid, row - 1, col);
        dfs(grid, row + 1, col);
        dfs(grid, row, col - 1);
        dfs(grid, row, col + 1);
    }
    numIslands(gridIn);
    return result;
}

const dataIn = [
    ["0", "1", "0", "1", "1", "0"],
    ["0", "1", "1", "0", "1", "0"],
    ["0", "0", "0", "0", "0", "0"],
    ["0", "1", "1", "0", "0", "0"],
    ["0", "0", "0", "1", "0", "0"],
    ["0", "0", "0", "0", "1", "1"],
];
export default function getAlgorithms() {
    return [
        {
            id: "a",
            name: "Case 1",
            init: () => clone(dataIn),
            code: code,
            fn: () => {
                return numIslandsDFS(clone(dataIn));
            },
        }
    ];
}
