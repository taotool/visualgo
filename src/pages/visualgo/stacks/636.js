const instructions = [];
const code = `
function exclusiveTime(n, logs) {
    let res = new Array(n).fill(0);
    let stack = [];

    for (let log of logs) {
        let parts = log.split(":");

        if (parts[1] === "start") {
            stack.push(log);
        } else { // end
            // 先计算当前function的执行时间
            let id = parseInt(parts[0]);
            let time = parseInt(parts[2]);

            let startTime = parseInt(stack.pop().split(":")[2]);
            let interval = time - startTime + 1;
            res[id] += interval;

            // 再把当前执行时间从父function时间中扣除
            // 注意此时父function的总时间还没计算出来，因为父function还没结束
            if (stack.length > 0) {
                let prevId = parseInt(stack[stack.length - 1].split(":")[0]); // must be start
                res[prevId] -= interval;
            }
        }
    }
    return res;
}
`;
function exclusiveTime(n, logs) {
    let res = new Array(n).fill(0);

    instructions.push({commands: [
        { cmd: "RESULT_DRAW_ARRAY", params: [new Array(n).fill(0)] },
    ], description: `Init` });

    let stack = [];

    // for (let log of logs) {
    for(let i=0; i< logs.length; i++) {
        const log = logs[i];
        let parts = log.split(":");

        if (parts[1] === "start") {
            stack.push(log);

            instructions.push({commands: [
                { cmd: "PUSH", params: [log]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },

            ], description: `push ${log}` });

        } else { // end
            // 先计算当前function的执行时间
            let id = parseInt(parts[0]);
            let time = parseInt(parts[2]);

            let startTime = parseInt(stack.pop().split(":")[2]);
            let interval = time - startTime + 1;
            res[id] += interval;

            instructions.push({commands: [
                { cmd: "POP", params: []},
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i] },
                { cmd: "RESULT_UPDATE", params: [0, id, res[id]] },

            ], description: `Update ${id}, ${res[id]}` });

            // 再把当前执行时间从父function时间中扣除
            // 注意此时父function的总时间还没计算出来，因为父function还没结束
            if (stack.length > 0) {
                let prevId = parseInt(stack[stack.length - 1].split(":")[0]); // must be start
                res[prevId] -= interval;

                instructions.push({commands: [
                    { cmd: "RESULT_UPDATE", params: [0, prevId, res[prevId]] },
    
                ], description: `Update ${prevId}, ${res[prevId]}` });
            }
        }
    }
    return res;
}


export default () => {
    return [
        {
            id: "b1",
            name: "Case 1",
            init: () => [],
            arrayData: ["0:start:0","1:start:2","2:start:3","2:end:4","1:end:5","0:end:6"],
            fn: () => {
                instructions.length = 0;
                exclusiveTime(3, ["0:start:0","1:start:2","2:start:3","2:end:4","1:end:5","0:end:6"]);
                return instructions;
            },
            code: code,
        }, 
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;
export const resultEnabled = true;