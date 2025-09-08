import clone from 'clone';

const listToGraph = (listData) => {
    
    // Convert to graph format
    // const nodes = Array.from(new Set(listData.flatMap(d => [d.name, d.next]))).map(name => ({ id: name }));
    const nodes = listData.map(({ name, next }) => ({ id: name, next }));
    const edges = listData.map(d => ({ source: d.name, target: d.next }));
    
    const graphData = {type:"directed", nodes, edges };
    return graphData;
}

const arrayToList = (arrayData) => {
    const listData = arrayData.map((value, index) => ({
        id: "link-"+index,
        index: index,
        value,
    }));
    listData.unshift({id:"DUMMY_HEAD", value: -1, index:-100});
    listData.push({id:"DUMMY_TAIL", value: 99, index: arrayData.length});
    for(let i=0; i<listData.length-1; i++) {
        listData[i].next = listData[i+1];
    }
    return listData[1];
}
function swapNodes() {
    const instructions = [];
    instructions.push({commands: [{cmd: "LIST_SWAP_NODES",params:[0,1]}], description: `swap ${0} with ${1}`});

    return instructions;
}
function insertNode() {
    const instructions = [];
    instructions.push({commands: [{cmd: "LIST_INSERT_NODE",params:[2, "third"]}], description: `swap ${0} with ${1}`});

    return instructions;
}

function insertNode3() {
    const instructions = [];
    instructions.push({commands: [{cmd: "LIST_DRAW_LIST",params:[["new",11,2,3,4,5]]}], description: `swap ${0} with ${1}`});

    return instructions;
}
function deleteNode() {
    const instructions = [];
    instructions.push({commands: [{cmd: "LIST_DELETE_NODE",params:[2]}], description: `swap ${0} with ${1}`});

    return instructions;
}
function updateLabel() {
    const instructions = [];
    instructions.push({commands: [
        {cmd: "LIST_UPDATE_POINTER",params:["top1", -1, "prev"]},
        {cmd: "LIST_UPDATE_POINTER",params:["top2", 0, "head"]},
        {cmd: "LIST_UPDATE_POINTER",params:["bottom1", 1, "next"]},
    ], description: `swap ${0} with ${1}`});

    return instructions;
}


const linkedListData = [11,2,3,4,5];
export default function anyname() {
    return [
        {
            id: "first",
            name: "Add to First",
            init: () => linkedListData,
            fn: () => {
                return insertNode();
            }
        },
        {
            id: "first3",
            name: "Draw Result Array",
            fn: () => {
                return insertNode3();
            }
        },
        {
            id: "middle",
            name: "Delete",
            fn: () => {
                return deleteNode();
            }
        },
        {
            id: "swap",
            name: "Swap",
            fn: () => {
                return swapNodes();
            }
        },
        {
            id: "labe",
            name: "Update Label",
            fn: () => {
                return updateLabel();
            }
        }
    ];
}