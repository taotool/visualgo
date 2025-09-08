const code =  `
function minOperations(logs) {
    const result = [];
    const stack = [];
    for (const log of logs) {
        if (log === "../") {
            if (stack.length > 0) {
                const p = stack.pop();
            }
        } else if (log === "./") {
            //
        } else if (log !== "./") {
            stack.push(log);
        }
    }
    return result;
}
`.trim();


function minOperations(logs) {
    const instructions = [];
    const stack = [];
    //for (const log of logs) {
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (log === "../") {
            if (stack.length > 0) {
                const p = stack.pop();
                instructions.push({commands: [
                    { cmd: "POP", params: []},
                    { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i] },
                ], description: `pop '${p}'` }); //'${JSON.stringify(logs)}'
            }
        } else if (log === "./") {
            instructions.push({commands: [
                { cmd: "c", params: [log]},
                { cmd: "ARRAY_HIGHLIGHT_CELL", params: [i] },
            ], description: `ignore '${log}'` });
        } else {
            stack.push(log);
            instructions.push({commands: [
                { cmd: "PUSH", params: [log]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
            ], description: `push '${log}'` });
        }
    }
    return instructions;
}
export default function anyname() {
    return [
        {id: "b1",
        name: "Case 1",
        init: () => ["d1/","d2/","../","d21/","./"],
        arrayData: ["d1/","d2/","../","d21/","./"],
        fn: () => {
            return minOperations(["d1/","d2/","../","d21/","./"]);
        },
        code: code,
        },
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;
