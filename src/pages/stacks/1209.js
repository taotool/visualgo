const instructions = [];
const code = `
class Solution {
    public String removeDuplicates(String s, int k) {
        Deque<Character> stack = new ArrayDeque<>();
        Deque<Integer> istack = new ArrayDeque<>();
        for(int i = 0; i<s.length(); i++) {
            char c = s.charAt(i);

            //stack保存当前字符，istack保存当前字符的个数
            if(!stack.isEmpty() && stack.peek()==c){
                istack.push(istack.peek()+1);
            } else {
                istack.push(1);
            }
            stack.push(c);

            //若满足条件，个数等于k，pop
            while(!stack.isEmpty() && stack.peek()==c && istack.peek()==k) {
                for(int j=0;j<k;j++) {
                    stack.pop();
                    istack.pop();
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        while(!stack.isEmpty()) sb.append(stack.pop());
        return sb.reverse().toString();
    }
}
`.trim();
function removeDuplicates(s, k) {
    const stack = [];
    const istack = [];
    
    for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i);

        let n = 0;
        // stack保存当前字符，istack保存当前字符的个数
        if (stack.length > 0 && stack[stack.length - 1] === c) {
            n = istack[istack.length - 1] + 1;
        } else {
            n = 1;
        }
        istack.push(n);

        stack.push(c);


        instructions.push({commands: [
            { cmd: "PUSH", params: [s.charAt(i) + ": "+n]},
            { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [14] },
            

        ], description: `push ${n}` });

        // 若满足条件，个数等于k，pop
        while (stack.length > 0 && stack[stack.length - 1] === c && istack[istack.length - 1] === k) {
            for (let j = 0; j < k; j++) {
                stack.pop();
                istack.pop();

                instructions.push({commands: [
                    { cmd: "POP", params: []},
                    { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i-j] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [20] },

                ], description: `pop` });
            }
        }
    }
    
    return stack.reverse().join('');
}

export default () => {
    return [
        {
            id: "b1",
            name: "Case 1",
            init: () => [],
            arrayData: "deeedbbcccbdaa".split(""),
            fn: () => {
                instructions.length = 0;
                removeDuplicates("deeedbbcccbdaa", 3);
                return instructions;
            },
            code: code,
        }, 
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;