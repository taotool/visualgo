const code =  `
public int lengthOfLongestSubstring(String s) {
    int res = 0;
    int left = 0;
    Set<Character> set = new HashSet<>();
    for(int i=0;i<s.length();i++) {
        while(true) {//如果set里已经包含当前char，就右移左指针
            if(!set.contains(s.chartAt(i))) {
                set.add(s.charAt(i));
                break;
            }
            set.remove(s.charAt(left++));
        }
        res = Math.max(res, i-left+1);//计算窗口长度，比如0,1,2， 长度2-0+1  = 3
    }

    return res;
}
`.trim();
function lengthOfLongestSubstring(s) {
    const instructions = [];
    let res = 0;
    let left = 0;
    instructions.push({commands: [
        { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
        { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },

    ], description: `` });

    const set = new Set();
    for (let i = 0; i < s.length; i++) {

        while (true) { // If set already contains the current char, move the left pointer to the right
            if (!set.has(s.charAt(i))) {
                set.add(s.charAt(i));
                instructions.push({commands: [
                    { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", i, "i="+i]},
                    { cmd: "ARRAY_HIGHLIGHT_CELL", params: [i]},
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [8] },
            
                ], description: `added ${s.charAt(i)}. set: ${Array.from(set).join(' ')}` });
                break;
            }
            instructions.push({commands: [
                { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", i, "i="+i]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i]},
                { cmd: "CODE_HIGHLIGHT_LINE", params: [11] },
        
            ], description: `cannot add ${s.charAt(i)}. set: ${Array.from(set).join(' ')}` });

            set.delete(s.charAt(left));


            left++;
            instructions.push({commands: [
                { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
                { cmd: "CODE_HIGHLIGHT_LINE", params: [12] },
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [left-1]},

        
            ], description: `removed ${s.charAt(left-1)} at ${left-1} set: ${Array.from(set).join(' ')}` });
        }
        res = Math.max(res, i - left + 1); // Calculate window length, e.g., 0,1,2, length 2-0+1 = 3

        instructions.push({commands: [
            { cmd: "CODE_HIGHLIGHT_LINE", params: [13] },
        ], description: `res = ${res} set: ${Array.from(set).join(' ')}` });
        
    }
    instructions.push({commands: [
        { cmd: "CODE_HIGHLIGHT_LINE", params: [16] },
    ], description: `final res = ${res} set: ${Array.from(set).join(' ')}` });
    // return res;
    return instructions;
}


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

export default function anyname() {
    return [
        {id: "b1",
        name: "Case 1",
        init: () => "abcabcbb".split(""),
        fn: () => {
            return lengthOfLongestSubstring("abcabcbb");
        },
        code: code,
        },
    ];
}