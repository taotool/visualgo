    const code = `
function minPathCostDFS(gridIn, moveCostIn){
    const result = [];
    function minPathCost(grid, moveCost) {
        let res = 999999;
        const memo = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
        for (let  j = 0;  j < grid[0].length;  j++) {
            res = Math.min(res, dfs(grid, moveCost, 0,  j, memo));

        }

        return res;
    }

    function dfs(grid, moveCost, row, col, memo) {//0 row
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return 0;
        if (row === grid.length - 1) {

            return grid[row][col];
        }
        if (memo[row][col] !== null) {

            return memo[row][col];
        }

        let res = 88888;
        const val = grid[row][col];//current v

        // try all cols
        for (let j = 0; j < grid[0].length;  j++) {
            const cost = moveCost[val][ j]; // 注意是到各子的代价
            const child = dfs(grid, moveCost, row + 1, j, memo);//

            res = Math.min(res, val + cost + child);

        }
        return memo[row][col] = res;
    }

    minPathCost(gridIn, moveCostIn);
    return result;
}
    `;

    function minPathCostDFS(gridIn, moveCostIn){
        const result = [];
        function minPathCost(grid, moveCost) {
            let res = 999999;
            const memo = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
            for (let  j = 0;  j < grid[0].length;  j++) {
                res = Math.min(res, dfs(grid, moveCost, 0,  j, memo));
                result.push({ action: "POH_N", params: [0, j, res],  description: `latest min ${res}` });
    
            }
            result.push({ action: "POH_N", params: [0, grid[0].length-1, res],  description: `global min ${res}` });
    
            return res;
        }
    
        function dfs(grid, moveCost, row, col, memo) {//0 row
            if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return 0;
            if (row === grid.length - 1) {
                result.push({ action: "PRH_N", params: [row+1, col, grid[row][col]],  description: `last row min ${grid[row][col]}` });
    
                return grid[row][col];
            }
            if (memo[row][col] !== null) {
                result.push({ action: "POH_N", params: [row, col, memo[row][col]],  description: `found cached min ${memo[row][col]}` });
    
                return memo[row][col];
            }
    
            let res = 88888;
            const val = grid[row][col];//current v
            result.push({ action: "HL_N", params: [row, col],  description: `checking ${val}` });
    
            // try all cols
            for (let j = 0; j < grid[0].length;  j++) {
                const cost = moveCost[val][ j]; // 注意是到各子的代价
                result.push({ action: "PRH_N", params: [row + 1, j, cost],  description: `going to check child ${grid[row + 1][j]}` });
                const child = dfs(grid, moveCost, row + 1, j, memo);//
                result.push({ action: "TRY", params: [row + 1,  j, val + cost + child, child],  description: `got child ${child}` });
    
                res = Math.min(res, val + cost + child);
                result.push({ action: "POH_N", params: [row + 1, j, res],  description: `latest min ${res}` });
    
            }
            return memo[row][col] = res;
        }
    
        minPathCost(gridIn, moveCostIn);
        return result;
    }
    export function getAlgorithms () {
        return [
            {id: "a",
            name: "Case 1",
            params: [[[5,3],[4,0],[2,1]], [[9,8],[1,5],[10,12],[18,6],[2,4],[14,3]]],
            code: code,
            fn: "minPathCostDFS(fn.params[0], fn.params[1])"
            }
        ];

    }
