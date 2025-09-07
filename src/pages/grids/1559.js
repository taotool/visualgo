import clone from 'clone';
const instructions = [];
const code = `
class Solution {
    public boolean containsCycle(char[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        //这个visited是全局
        boolean[][] visited = new boolean[rows][cols];
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                if(visited[i][j]) continue;
                if(bfs(grid, i, j, visited)) return true;
            }
        }
        return false;
    }

    private boolean bfs(char[][] grid, int row, int col, boolean[][] visited){
        int rows = grid.length;
        int cols = grid[0].length;

        Queue<int[]> queue = new LinkedList<>();
        //为什么要记下父结点？这里不能用visited来防止重复。visited用来判断是否有环。
        queue.offer(new int[]{row, col, -1, -1});
        char curr = grid[row][col];//当前环结点的值

        int[][] dirs = {{-1, 0},{1, 0},{0, -1},{0, 1}};
        while(!queue.isEmpty()){
            int[] pos = queue.poll();

            int i = pos[0];
            int j = pos[1];
            int pi = pos[2];
            int pj = pos[3];
            //放在enqueue也可以。
            if(visited[i][j]) return true;//found a cycle
            visited[i][j] = true;
            for(int[] dir : dirs){
                int ni = i+dir[0];
                int nj = j+dir[1];

                if(ni<0 || ni>=rows || nj<0 || nj>=cols) continue;
                if(grid[ni][nj]!=curr) continue;
                if(ni==pi && nj==pj) continue;//放入父结点非常巧妙！！！


                //准备下一轮
                queue.offer(new int[]{ni, nj, i, j});

            }
        }
        return false;
    }
}

`.trim();

function containsCycle(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j]) continue;
            if (bfs(grid, i, j, visited)) return true;
        }
    }
    return false;
}

function bfs(grid, row, col, visited) {
    const rows = grid.length;
    const cols = grid[0].length;

    const queue = [];
    queue.push([row, col, -1, -1]);
    instructions.push({ commands: [
        { cmd: "OFFER", params: [JSON.stringify([row, col])]},
        { cmd: "GRID_PRE_HIGHLIGHT_CELL", params: [row, col]},
        { cmd: "CODE_HIGHLIGHT_LINE", params: [21] },
    ], 
    description: `offer ` });


    const curr = grid[row][col];

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    while (queue.length > 0) {
        const pos = queue.shift();
        instructions.push({ commands: [
            { cmd: "POLL"},
            { cmd: "GRID_HIGHLIGHT_CELL", params: [pos[0], pos[1]]},
            { cmd: "CODE_HIGHLIGHT_LINE", params: [14] },
        ], 
        description: `poll ${pos[0]}, ${pos[1]}, parent: ${pos[2]}, ${pos[3]}` });

        const i = pos[0];
        const j = pos[1];
        const pi = pos[2];
        const pj = pos[3];

        if (visited[i][j]) return true; // found a cycle
        visited[i][j] = true;
        for (const dir of dirs) {
            const ni = i + dir[0];
            const nj = j + dir[1];

            if (ni < 0 || ni >= rows || nj < 0 || nj >= cols) continue;
            if (grid[ni][nj] !== curr) continue;
            if (ni === pi && nj === pj) continue; // clever use of parent node

            // prepare for the next round
            queue.push([ni, nj, i, j]);


            instructions.push({ commands: [
                { cmd: "OFFER", params: [JSON.stringify([ni, nj])]},
                { cmd: "GRID_PRE_HIGHLIGHT_CELL", params: [ni, nj]},
                { cmd: "CODE_HIGHLIGHT_LINE", params: [21] },
            ], 
            description: `offer ` });
        }
    }

    
    return false;
}



const dataIn = [
    ["c", "c", "c", "a"],
    ["c", "d", "c", "c"],
    ["c", "c", "e", "c"],
    ["f", "c", "c", "c"]
];

export default function anyname() {
    return [
        {
            id: "a",
            name: "Case 1",
            init: () => dataIn,
            code: code,
            fn: () => {
                instructions.length = 0;
                containsCycle(clone(dataIn));
                return instructions;
            }
        }
    ];

}

export const queueEnabled = true;