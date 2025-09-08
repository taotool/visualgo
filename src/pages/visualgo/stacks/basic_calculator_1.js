const code =  `
class Solution {
    public int calculate(String s) {
        Deque<Integer> stack = new ArrayDeque<>();//栈内永远存储带正负号的数字
        int res = 0;
        int sign = 1;
        for(int i=0;i<s.length();i++){
            char c = s.charAt(i);
            if(Character.isDigit(c)){
                int num = 0;
                while(i<s.length() && Character.isDigit(s.charAt(i))){
                    num = num * 10 + (s.charAt(i)-'0');
                    i++;
                }
                i--;
                res += sign*num;//3, 7
            } else if (c=='+') {
                sign = 1;
            } else if (c=='-'){
                sign = -1;
            } else if (c=='(') {
                stack.push(res);//(1+(3+4)) 把括号之前的结果入栈
                stack.push(sign);//[1, + ]//再把括号之前的符号入栈
                res = 0;
                sign = 1;
            } else if (c==')') {//[1, + ]
                res *= stack.pop();//把括号里的res加上符号
                res += stack.pop();//再和栈内数字相加
            }
        }
        return res;
    }
}
`.trim();

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
        init: () => [],
        arrayData: "(1+(4+5+2)-3)+(6+8)".split(""),
        fn: () => {
            return calculate("(1+(4+5+2)-3)+(6+8)");
        },
        code: code,
        },
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;