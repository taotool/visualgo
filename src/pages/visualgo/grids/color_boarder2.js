function ColoringBorderDFS() {
   
        const grid = [
            [1, 2, 2, 2, 2, 2],
            [2, 3, 2, 2, 2, 2],
            [2, 3, 2, 2, 2, 2],
            [2, 3, 2, 2, 2, 2],
            [2, 3, 2, 2, 2, 2],
            [2, 3, 2, 2, 2, 6],
        ];
    


    function colorBorder(grid, row, col, color) {
        const orig = copy(grid);
        const visited = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
        dfs(grid, orig, row, col, grid[row][col], color, visited);
        return grid;
    }

    function dfs(grid, orig, row, col, old, color, visited) {
        if (
            row < 0 || row >= grid.length ||
            col < 0 || col >= grid[0].length ||
            grid[row][col] !== old || visited[row][col]
        ) {
            return;
        }

        visited[row][col] = true;

        if (check(orig, row, col, old)) {
            grid[row][col] = color;
        }

        const dirs = [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1],
        ];
        for (const [dr, dc] of dirs) {
            const newRow = row + dr;
            const newCol = col + dc;
            dfs(grid, orig, newRow, newCol, old, color, visited);
        }
    }

    function check(grid, row, col, old) {
        const dirs = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        for (const [dr, dc] of dirs) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                newRow < 0 || newRow >= grid.length ||
                newCol < 0 || newCol >= grid[0].length ||
                grid[newRow][newCol] !== old
            ) {
                return true;
            }
        }
        return false;
    }

    function copy(grid) {
        return grid.map(row => row.slice());
    }


    const row = 0;
    const col = 1;
    const color = 5;
    colorBorder(grid, row, col, color);
    console.log(grid);

}


