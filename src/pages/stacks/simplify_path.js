const code =  `
class Solution {
    public String simplifyPath(String path) {
        String[] paths = path.split("/");

        Deque<String> stack = new ArrayDeque<>();
        for(String p : paths) {
            if(p.length()==0 || p.equals(".")) continue;

            if (p.equals("..")){
                if(!stack.isEmpty()) stack.pop();
            } else {
                stack.push(p);
            }
        }
        StringBuilder sb = new StringBuilder();
        while(!stack.isEmpty()) {
            sb.insert(0,stack.pop());
            sb.insert(0,"/");
        }
        if(sb.length()==0) sb.append("/");
        return sb.toString();
    }
}

`.trim();
const instructions = [];
function calculate(s) {
    const instructions = [];

    const stack = []; // Stack to store results and signs
    let res = 0;
    let sign = 1;
    for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i);
        if (c === '+') {
            sign = 1;
        } else if (c === '-') {
            sign = -1;
        } else if (c === '(') {
            stack.push(res); // Push the result before the parenthesis
            instructions.push({commands: [
                { cmd: "PUSH", params: [res]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [20] },

            ], description: `push res: '${res}'` });

            stack.push(sign); // Push the sign before the parenthesis

            instructions.push({commands: [
                { cmd: "PUSH", params: [sign]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [20] },

            ], description: `push sign: '${sign}', res '${res}'` });

            res = 0;
            sign = 1;
        } else if (c === ')') {
            const poppedsign = stack.pop();
            res *= poppedsign; // Apply the sign before the parenthesis
            instructions.push({commands: [
                { cmd: "POP", params: []},
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },
        
            ], description: `pop '${poppedsign}', res *= poppedsign: '${res}'` });

            const poppedRes = stack.pop();
            res += poppedRes; // Add the result before the parenthesis
            instructions.push({commands: [
                { cmd: "POP", params: []},
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i] },

                { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },
        
            ], description: `pop '${poppedRes}', res += poppedRes: '${res}'` });
        } else {
            let num = 0;
            while (i < s.length && !isNaN(s.charAt(i))) {
                num = num * 10 + (s.charAt(i) - '0');
                i++;
            }
            i--;
            res += sign * num; // Add the number with the current sign

            instructions.push({commands: [
                { cmd: "ARRAY_HIGHLIGHT_CELL", params: [i] },

            ], description: `calc '${num}', res += sign * num: '${res}'` });
        }
    }
    instructions.push({commands: [

    ], description: `got '${res}'` });
    return instructions;

    // return res;
}

function simplifyPath(paths) {
    instructions.push({commands: [
        { cmd: "ARRAY_INIT", params: [[paths]] },

    ], description: `init` });
    const stack = [];
    // for (const p of paths) {
    for (let i=0; i < paths.length; i++){
        const idx = i;//path.charAt(i)==="/"?i+1:i;

        const p = paths[i];
        if (p.length === 0 || p === "." || p === "/") {

            instructions.push({commands: [
                { cmd: "ARRAY_HIGHLIGHT_CELL", params: [idx] },

            ], description: `ignore ${p} at ${idx}` });
            continue;
        }
        if (p === "..") {
            if (stack.length > 0) {
                stack.pop();

                instructions.push({commands: [
                    { cmd: "POP", params: []},
                    { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [idx] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },
            
                ], description: `pop ..` });
            }
        } else {
            stack.push(p);

            instructions.push({commands: [
                { cmd: "PUSH", params: [p]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [idx] },

            ], description: `push ${p}` });
        }
    }

    const sb = [];
    while (stack.length > 0) {
        sb.unshift(stack.pop());
        sb.unshift("/");
    }

    if (sb.length === 0) sb.push("/");

    instructions.push({commands: [

    ], description: `result ${sb.join("")}` });
    return sb.join("");
}

export default () => {
    return [
        {
            id: "b1",
            name: "Case 1",
            init: () => [],
            arrayData: ["/", "a", "/", "b", "/", "..", "/"],
            fn: () => {
                instructions.length = 0;
                simplifyPath(["/", "a", "/", "b", "/", "..", "/"]);
                return instructions;
            },
            code: code,
        }, {
            id: "b2",
            name: "Case 2",
            init: () => [],
            arrayData: ["/", "home", "/", "/", "foo", "/"],
            fn: () => {
                instructions.length = 0;
                simplifyPath(["/", "home", "/", "/", "foo", "/"]);
                return instructions;
            },
            code: code,
        },
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;