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


function subsets(nums, recreate=false) {
    const res = [];
    const instructions = [];
    let nodeIdx = 0;


    const CMD = recreate ? "CRE" : "HL_N";
    function createNode(id, name) { 
        return {id, name: name,children: []};
    }
    function dfs(nums, start, curr, res, node) {
        res.push([...curr]); //[], [1], [1, 2] [1, 2, 3] [1, 3] [2, 3] [3]
        instructions.push({commands: [ 
            { cmd: "R", params: [], graphData: convertToGraph(root) },
            { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
            { cmd: "OFFER", params: [JSON.stringify(curr)]},
        ], description: `add to result`, result: JSON.stringify(curr)+" => "+ JSON.stringify(res)});// +", "+ JSON.stringify(res)});


        for (let i = start; i < nums.length; i++) {
            curr.push(nums[i]);

            const child = createNode("n" + (nodeIdx++), JSON.stringify(curr));
            node.children.push(child);
            instructions.push({commands: [ 
                { cmd: CMD, params: [child.id], graphData: convertToGraph(root) },
                { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
                { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", i, "i="+i]}
            ], description: `select '${nums[i]}'`, result: "=> "+ JSON.stringify(curr)});// +", "+ JSON.stringify(res)});


            dfs(nums, i + 1, curr, res, child);
            curr.pop();
            instructions.push({commands: [ 
                { cmd: "POH_N", params: [child.id], graphData: convertToGraph(root) },
                { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", start,"start="+start]},
                { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", i, "i="+i]}

            
            ], description: `deselect '${nums[i]}'`, result: "=> "+ JSON.stringify(curr)});// +", "+ JSON.stringify(res)});



        }
        //instructions.push({commands:  [{ cmd: "POH_N", params: [node.id], graphData: convertToGraph(node) }],description: `done with position ${start}`, result: JSON.stringify(curr)});// +", "+ JSON.stringify(res)});


    }
    const root = createNode("n" + (nodeIdx++), JSON.stringify([]));
    instructions.push({commands:  [{ cmd: CMD, params: [root.id], graphData: convertToGraph(root) }],description: `select empty`, result: JSON.stringify(res)});

    dfs(nums, 0, [], res, root);

    instructions.push({ commands: [{ cmd: "POH_N", params: [root.id], graphData: convertToGraph(root) }], description: "Done", result: JSON.stringify(res) });
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
                return subsets([1, 2, 3])[0];
            },
            fn: () => {
                return subsets([1, 2, 3])[1];
            },
            code: code,
        },
        {
            id: "b1",
            name: "Case 1",
            init: () =>{
                return subsets([1, 2, 3])[0];
            },
            fn: () => {
                return subsets([1, 2, 3], true)[1];
            },
            code: code,
        },
    ];
}

export const arrayEnabled = true;

export const queueEnabled = true;