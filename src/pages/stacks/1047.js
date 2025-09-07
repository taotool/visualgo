const instructions = [];
const code = `
class Solution {
    public String removeDuplicates(String s) {
        if(s == null || s.length()<2) return s;
        Deque<Character> stack = new ArrayDeque<>();
        for(int i=0;i<s.length();i++) {
            if(!stack.isEmpty() && s.charAt(i)==stack.peek()) {
                stack.pop();
            } else {
                stack.push(s.charAt(i));
            }
        }
        StringBuilder sb= new StringBuilder();
        while(!stack.isEmpty()) {
            sb.append(stack.pop());
        }
        return sb.reverse().toString();
    }
}

`;


function removeDuplicates(s) {
    if (s === null || s.length < 2) return s;
    const stack = [];
    for (let i = 0; i < s.length; i++) {
        if (stack.length > 0 && s.charAt(i) === stack[stack.length - 1]) {
            stack.pop();

            instructions.push({commands: [
                { cmd: "POP", params: []},
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [i] },

            ], description: `pop` });

        } else {
            stack.push(s.charAt(i));

            instructions.push({commands: [
                { cmd: "PUSH", params: [s.charAt(i)]},
                { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i] },

            ], description: `push ${s.charAt(i)}` });
        }
    }
    let sb = '';
    while (stack.length > 0) {
        sb += stack.pop();
    }
    return sb.split('').reverse().join('');
}
export default () => {
    return [
        {
            id: "b1",
            name: "Case 1",
            init: () => [],
            arrayData: "abbaca".split(""),
            fn: () => {
                instructions.length = 0;
                removeDuplicates("abbaca");
                return instructions;
            },
            code: code,
        }, 
    ];
}

export const stackEnabled = true;
export const arrayEnabled = true;