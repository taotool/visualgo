const code =  `
    public int findMaxConsecutiveOnes(int[] nums) {
        int res = 0;
        int left = -1;//最后一个不为1的位置
        for(int i=0;i<nums.length;i++) {
            if(nums[i]!=1){
                res = Math.max(res,  i-left-1);//0,1,1,1,0 [left = 0, i=4, 4-0-1 = 3]
                left = i;
            }
        }
        if(left!=nums.length-1) {//last one is 1
            res = Math.max(res,  nums.length-left-1);
        }
        return res; 
    }
`.trim();
const instructions = [];
function findMaxConsecutiveOnes(nums) {
    let res = 0;
    let left = -1; // last position of 0
    instructions.push({commands: [
        { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
        { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },

    ], description: `` });
    for (let i = 0; i < nums.length; i++) {
        instructions.push({commands: [
            { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", i, "i="+i]},
            { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i]},
            { cmd: "CODE_HIGHLIGHT_LINE", params: [11] },
    
        ], description: `set i ${i}` });

        if (nums[i] !== 1) {
            res = Math.max(res, i - left - 1); // 0,1,1,1,0 [left = 0, i=4, 4-0-1 = 3]
            left = i;

            instructions.push({commands: [
                { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
                { cmd: "CODE_HIGHLIGHT_LINE", params: [12] },
                { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [left]},

        
            ], description: `set left ${left}, res: ${res}`, });

        }
    }
    if (left !== nums.length - 1) { // last one is 1
        res = Math.max(res, nums.length - left - 1);

        instructions.push({commands: [
            { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
            { cmd: "CODE_HIGHLIGHT_LINE", params: [12] },
            { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [left]},

    
        ], description: `last, set left ${left}, res: ${res}`, });
    }
    return res;
}



const code2 =  `
function findMaxConsecutiveOnes2(nums) {
    let res = 0;
    let left = -1;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 1) {
            if(left===-1) {
                left = i;
            }
            res = Math.max(res, i - left + 1);
        } else {
            left = -1;
        }
    }
    return res;
}
`.trim();
function findMaxConsecutiveOnes2(nums) {
    let res = 0;
    let left = -1; // last position of 0
    instructions.push({commands: [
        { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
        { cmd: "CODE_HIGHLIGHT_LINE", params: [23] },

    ], description: `` });
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 1) {
            if(left===-1) {
                left = i;
            }
            res = Math.max(res, i - left + 1);
        } else {
            left = -1;
        }

        instructions.push({commands: [
            { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", left, "left="+left]},
            { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", i, "i="+i]},
            { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [i]},
            { cmd: "CODE_HIGHLIGHT_LINE", params: [11] },
    
        ], description: `set i ${i}, left ${left}, res ${res}` });

    }
    
    return res;
}


export default function anyname() {
    return [
        {id: "b1",
        name: "Case 1",
        init: () => [1,1,0,1,1,1],
        fn: () => {
            instructions.length = 0;
            findMaxConsecutiveOnes([1,1,0,1,1,1]);
            return instructions;
        },
        code: code,
        },
        {id: "b2",
            name: "Case 2",
            init: () => [1,1,0,1,1,1],
            fn: () => {
                instructions.length = 0;
                findMaxConsecutiveOnes2([1,1,0,1,1,1]);
                return instructions;
            },
            code: code2,
            },
    ];
}