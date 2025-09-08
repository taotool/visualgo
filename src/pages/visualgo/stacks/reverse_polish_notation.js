const code =  `
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for(String s : tokens) {
            if(s.equals("+")
                    || s.equals("-")
                    || s.equals("*")
                    || s.equals("/")) {
                int second = stack.pop();
                int first = stack.pop();
                if(s.equals("+") ) {
                    stack.push(first+second);
                } else if(s.equals("-") ) {
                    stack.push(first-second);
                } else if(s.equals("*") ) {
                    stack.push(first*second);
                } else if(s.equals("/") ) {
                    stack.push(first/second);
                }
            } else {
                stack.push(Integer.valueOf(s));
            }
        }
        return stack.pop();
    }
`.trim();

function evalRPN(tokens) {
    const instructions = [];
    const stack = [];

    for (let i=0; i<tokens.length; i++) {
        const s = tokens[i];
        if (s === "+" || s === "-" || s === "*" || s === "/") {
            const second = stack.pop();
            instructions.push({commands: [
                { cmd: "POP", params: []},
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [8] },
            ], description: `pop '${second}'` });

            const first = stack.pop();
            instructions.push({commands: [
                { cmd: "POP", params: []},
                { cmd: "CODE_HIGHLIGHT_LINE", params: [9] },

            ], description: `pop '${first}'` });


            if (s === "+") {
                stack.push(first + second);

                instructions.push({commands: [
                    { cmd: "PUSH", params: [first + second]},
                    { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [11] },

                ], description: `push '${first + second}'` });

            } else if (s === "-") {
                stack.push(first - second);

                instructions.push({commands: [
                    { cmd: "PUSH", params: [first - second]},
                    { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [13] },

                ], description: `push '${first - second}'` });
            } else if (s === "*") {
                stack.push(first * second);

                instructions.push({commands: [
                    { cmd: "PUSH", params: [first * second]},
                    { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [15] },

                ], description: `push '${first * second}'` });
            } else if (s === "/") {
                stack.push(Math.trunc(first / second)); // Use Math.floor for integer division


                instructions.push({commands: [
                    { cmd: "PUSH", params: [Math.trunc(first / second)]},
                    { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [17] },

                ], description: `push '${Math.trunc(first / second)}'` });
            }
        } else {
            stack.push(parseInt(s, 10));

            instructions.push({commands: [
                { cmd: "PUSH", params: [s]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [20] },

            ], description: `push '${s}'` });
        }
    }
    const v = stack.pop();
    instructions.push({commands: [
        { cmd: "POP", params: []},
        { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },

    ], description: `pop '${v}'` });
    return instructions;
}

export default function anyname() {
    return [
        {id: "b1",
        name: "Case 1",
        init: () => [],
        arrayData: ["10","6","9","3","+","-11","*","/","*","17","+","5","+"],
        fn: () => {
            return evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]);
        },
        code: code,
        },
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;
