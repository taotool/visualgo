import clone from 'clone';
const instructions = [];
const code = `
class Solution {
    public void wallsAndGates(int[][] rooms) {
        Queue<int[]> queue = new LinkedList<>();
        for(int i=0;i<rooms.length;i++){
            for(int j=0;j<rooms[0].length;j++){
                if(rooms[i][j]==0){
                    queue.offer(new int[]{i,j});
                }
            }
        }
        
        int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
        while(!queue.isEmpty()){
            int[] curr = queue.poll();
            for(int[] dir : dirs) {
                int ni = curr[0] + dir[0];
                int nj = curr[1] + dir[1];
                if(ni<0||ni>=rooms.length || nj<0||nj>=rooms[0].length 
                   || rooms[ni][nj]!=Integer.MAX_VALUE) continue;//只关心没有走过的位置
                queue.offer(new int[]{ni, nj});
                rooms[ni][nj] = rooms[curr[0]][curr[1]]+1;//边走边记录长度
            }
        }
    }
    
}
`.trim();
function wallsAndGates(rooms) {
    const queue = [];
    for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[0].length; j++) {
            if (rooms[i][j] === 0) {
                queue.push([i, j]);
                
                instructions.push({ commands: [
                    { cmd: "OFFER", params: [JSON.stringify([i, j])]},
                    { cmd: "GRID_PRE_HIGHLIGHT_CELL", params: [i, j]},
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [7] },

                ], 
                description: `offer ` });

            }
        }
    }

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    while (queue.length > 0) {
        const curr = queue.shift();
        instructions.push({ commands: [
            { cmd: "POLL"},
            { cmd: "GRID_HIGHLIGHT_CELL", params: [curr[0], curr[1]]},
            { cmd: "CODE_HIGHLIGHT_LINE", params: [14] },
        ], 
        description: `poll ` });
        for (const dir of dirs) {
            const ni = curr[0] + dir[0];
            const nj = curr[1] + dir[1];
            if (ni < 0 || ni >= rooms.length || nj < 0 || nj >= rooms[0].length || rooms[ni][nj] !== 999) continue; // Only care about unvisited positions
            queue.push([ni, nj]);

            rooms[ni][nj] = rooms[curr[0]][curr[1]] + 1; // Update distance while traversing

            
            instructions.push({ commands: [
                { cmd: "OFFER", params: [JSON.stringify([ni, nj])]},
                { cmd: "GRID_PRE_HIGHLIGHT_CELL", params: [ni, nj]},
                { cmd: "GRID_UPDATE_CELL", params: [ni, nj, rooms[ni][nj]]},
                { cmd: "CODE_HIGHLIGHT_LINE", params: [21] },
            ], 
            description: `offer ` });

        }

        instructions.push({ commands: [
            { cmd: "POLL"},
            { cmd: "GRID_POST_HIGHLIGHT_CELL", params: [curr[0], curr[1]]},

        ], 
        description: `post ` });
    }
}


const dataIn = [
    [999,-1,0,999],
    [999,999,999,-1],
    [999,-1,999,-1],
    [0,-1,999,999]
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
                wallsAndGates(clone(dataIn));
                return instructions;
            }
        }
    ];

}

export const queueEnabled = true;