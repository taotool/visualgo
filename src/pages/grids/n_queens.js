import clone from 'clone';
const code = `
class Solution {
    public List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++) {
                board[i][j] = '.';
            }
        }
        List<List<String>> res = new ArrayList<>();
        //注意：一列一列处理，递归，直到最后一列
        dfs(res, 0, board);//always starts from col 0
        return res;
    }

    //only take care of one row
    private void dfs(List<List<String>> res, int col, char[][] board) {
        //已经到最后一列
        if(col==board.length) {
            List<String> list = new ArrayList<>();
            for(int i=0;i<board.length;i++) {
                StringBuilder sb = new StringBuilder();
                for(int j=0;j<board[i].length;j++) {
                    sb.append(String.valueOf(board[i][j]));
                }
                list.add(sb.toString());
            }
            res.add(list);
            return;
        }
        //对于当前列，检查所有的row是否合法
        for(int row=0; row<board.length; row++) {
            //curr col
            if(isValid(row, col, board)){
                board[row][col] = 'Q';
                dfs(res, col+1, board);
                board[row][col] = '.';
            }
        }

    }

    //判断当前位置是否可以放Q
    private boolean isValid(int row, int col, char[][] board){
        //check if Q is already in current column of previous rows

        for(int i=0;i<board.length;i++) {//0 .. curr row
            for(int j=0;j<board[i].length;j++) {//all columns
                if(board[i][j] == 'Q') {
                    if(i==row) return false;//同一行已存在。同一列肯定不会有，这是第一次处理这列
                    //难点，要举例得出对角线公式
                    if(row-i==col-j || row-i == j-col) {// \ and /
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
`.trim();

function createGridData(n) {
    return Array.from({ length: n }, () => Array(n).fill('+'));
}
function nQueens(n) {
    const instructions = [];

    function solveNQueens(n) {
        const board = createGridData(n);
        const res = [];
        dfs(res, 0, board); // always starts from col 0
        return res;
    }
    
    // only take care of one row
    function dfs(res, col, board) {
        // already at the last column
        if (col === board.length) {
            const list = [];
            for (let i = 0; i < board.length; i++) {
                list.push(board[i]);
            }
            res.push(list);
            instructions.push({
                commands: [
                ],
                description: `add ${list}`
            });
            return;
        }
        // for the current column, check all rows for validity
        for (let row = 0; row < board.length; row++) {
            // current col
            if (isValid(row, col, board)) {
                board[row][col] = 'Q';

                instructions.push({
                    commands: [
                        { cmd: "GRID_HIGHLIGHT_CELL", params: [row, col] },
                        { cmd: "GRID_UPDATE_CELL", params: [row, col, 'Q'] },
                        { cmd: "GRID_UPDATE_POINTER", params: ["left1", row, "row="+row] },
                        { cmd: "GRID_UPDATE_POINTER", params: ["top1", col, "col="+col] },
                    ],
                    description: `set `
                });

                dfs(res, col + 1, board);
                board[row][col] = '.';

                instructions.push({
                    commands: [
                        { cmd: "GRID_POST_HIGHLIGHT_CELL", params: [row, col] },
                        { cmd: "GRID_UPDATE_CELL", params: [row, col, '+'] },
                        { cmd: "GRID_UPDATE_POINTER", params: ["left1", row, "row="+row] },
                        { cmd: "GRID_UPDATE_POINTER", params: ["top1", col, "col="+col] },
                    ],
                    description: `reset `
                });
            }
        }
    }
    
    // check if the current position can place Q
    function isValid(row, col, board) {
        // check if Q is already in current column of previous rows
        for (let i = 0; i < board.length; i++) { // 0 .. curr row
            for (let j = 0; j < board[i].length; j++) { // all columns
                if (board[i][j] === 'Q') {
                    if (i === row) return false; // same row already exists. same column won't have it, this is the first time processing this column
                    // difficult point, need to derive diagonal formulas
                    if (row - i === col - j || row - i === j - col) { // \ and /
                        return false;
                    }
                }
            }
        }
        return true;
    }
    solveNQueens(n);
    return instructions;
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
            init: () => createGridData(4),
            code: code,
            fn: () => {
                return nQueens(4);
            },
        }
    ];
}
