import clone from 'clone';
import {convertToGraph} from './tree_utils';
const code = 
`class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void dfs(int[] nums, int start, List<Integer> curr, List<List<Integer>> res) {
        res.add(new ArrayList<>(curr));//[], [1], [1, 2] [1, 2, 3] [1, 3] [2, 3] [3]
        for(int i=start;i<nums.length;i++) {
            curr.add(nums[i]);
            dfs(nums, i+1, curr, res);
            curr.remove(curr.size()-1);
        }
    }
}`;

function subsets1b(nums, recreate=false) {
    const res = [];
    const instructions = [];
    let nodeIdx = 0;
    const CMD = recreate ? "CRE" : "HL_N";
    function createNode(id, name) { 
        return {id, name: name,children: []};
    }

    function dfs(nums, start, curr, res, node) {
        if (start === nums.length) {
            res.push([...curr]); //[], [1], [1, 2] [1, 2, 3] [1, 3] [2, 3] [3]

            instructions.push({commands: [ 
                { cmd: "R", params: [], graphData: convertToGraph(root) },
                { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
                { cmd: "OFFER", params: [JSON.stringify(curr)]},
            ], description: `add to result`, result: JSON.stringify(curr)+" => "+ JSON.stringify(res)});// +", "+ JSON.stringify(res)});
            return;
        }
        // Select
        curr.push(nums[start]);
        
        
        let child = createNode("n" + (nodeIdx++), JSON.stringify(curr));
        node.children.push(child);
        instructions.push({commands: [ 
            { cmd: CMD, params: [child.id], graphData: convertToGraph(root) },
            { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
        ], description: `select '${nums[start]}'`, result: "=> "+ JSON.stringify(curr)});// +", "+ JSON.stringify(res)});


        dfs(nums, start + 1, curr, res, child);

        // Do not select
        curr.pop();
        child = createNode("n" + (nodeIdx++), JSON.stringify(curr));
        node.children.push(child);
        instructions.push({commands: [ 
            { cmd: CMD, params: [child.id], graphData: convertToGraph(root) },
            { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
        ], description: `Skip '${nums[start]}'`, result: "=> "+ JSON.stringify(curr)});// +", "+ JSON.stringify(res)});

        

        dfs(nums, start + 1, curr, res, child);
    }

    const root = createNode("n" + (nodeIdx++), JSON.stringify([]));
    instructions.push({commands:  [{ cmd: CMD, params: [root.id], graphData: convertToGraph(root) }],description: `select empty`, result: JSON.stringify(res)});


    
    dfs(nums, 0, [], res, root);
    

    instructions.push({ commands: [], description: "Done", result: JSON.stringify(res) });
    const graphData = convertToGraph(root);
    return [graphData, instructions];
}



export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            arrayData: [1, 2, 3], 
            init: () =>{
                return subsets1b([1, 2, 3])[0];
            },
            fn: () => {
                return subsets1b([1, 2, 3])[1];
            },
            code: code,
        },
        {
            id: "b2",
            name: "Case 2",
            init: () =>{
                return subsets1b([1, 2, 3])[0];
            },
            fn: () => {
                return subsets1b([1, 2, 3], true)[1];
            },
            code: code,
        },
    ];
}

export const arrayEnabled = true;
export const queueEnabled = true;