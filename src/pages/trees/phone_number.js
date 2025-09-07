import {convertToGraph} from './tree_utils';

function letterCombinations(digits) {
    const map = new Map();
    map.set('2', "abc");
    map.set('3', "def");
    map.set('4', "ghi");
    map.set('5', "jkl");
    map.set('6', "mno");
    map.set('7', "pqrs");
    map.set('8', "tuv");
    map.set('9', "wxyz");
    const res = [];
    const instructions = [];
    let nodeIdx = 0;


    function dfs(digits, start, res, value, map, node) {
        if (start === digits.length) {
            res.push(value);
    
            instructions.push({commands: [ 
                { cmd: "R", params: [] },
                { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
                { cmd: "OFFER", params: [JSON.stringify(value)]},
            ], description: `add to result`, result: JSON.stringify(value)+" => "+ JSON.stringify(res)});// +", "+ JSON.stringify(res)});
            return;
        }
        const digit = digits.charAt(start);
        const str = map.get(digit);
        for (const s of str) {
    
            let child = createNode("n" + (nodeIdx++), JSON.stringify(value + s));
                    node.children.push(child);
                    instructions.push({commands: [ 
                        { cmd: "HL_N", params: [child.id] },
                        { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
                    ], description: `select '${s}'`, result: "=> "+ JSON.stringify(value + s)});// +", "+ JSON.stringify(res)});
            
            dfs(digits, start + 1, res, value + s, map, child);
        }
    }
    
    function createNode(id, name) { 
        return {id, name: name,children: []};
    }
    
    const root = createNode("n" + (nodeIdx++), JSON.stringify([]));
    instructions.push({commands:  [{ cmd: "HL_N", params: [root.id] }],description: `select empty`, result: JSON.stringify(res)});
    
    dfs(digits, 0, res, "", map, root);

    const graphData = convertToGraph(root);
    return [graphData, instructions];
}
export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            arrayData: [2, 3, 4], 
            init: () =>{
                return letterCombinations("234")[0];
            },
            fn: () => {
                return letterCombinations("234")[1];
            },
        }
    ];
}

export const arrayEnabled = true;

export const queueEnabled = true;