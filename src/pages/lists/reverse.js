

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
const reverseCode = `
    public static ListNode reverse (ListNode head) {
        ListNode prev = null;
        while(head!=null) {
            ListNode next = head.next;
            head.next = prev;
            prev= head;
            head = next;
        }
        return prev;
    }
`;
function reverse(head) {
    const instructions = [];

    let prev = {id:"DUMMY_HEAD", value: -1, index: -1};
    instructions.push({commands: [{cmd: "LIST_UPDATE_POINTER",params:["top1", prev.index, "prev"]},
        {cmd: "LIST_UPDATE_POINTER",params:["top2", head.index, "head"]},], description: `set prev as null`});

    while (head !== undefined && head.id != "DUMMY_TAIL") {

        let next = head.next;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["bottom1", next.index, "next"]},
            {cmd: "CODE_HIGHLIGHT_LINE",params:[5]},
        ],description: `set next as head.next`});

        head.next = prev;
        instructions.push({commands: [
            {cmd: "LIST_REVERSE_LINK",params:[head.id]},
            {cmd: "CODE_HIGHLIGHT_LINE",params:[6]},
        ], description: `set head's next to prev`});
        instructions.push({commands: [], description: ``});

        
        
        prev = head;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["top1", prev.index, "prev"]},
            {cmd: "CODE_HIGHLIGHT_LINE",params:[7]},
        ], description: `set prev as head`});
        head = next;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["top2", head.index, "head"]},
            {cmd: "CODE_HIGHLIGHT_LINE",params:[8]},
        ], description: `set head as next`});
        
    }
    // return prev;
    instructions.push({commands: [
        {cmd: "CODE_HIGHLIGHT_LINE",params:[10]},
    ], description: `Done`});

    return instructions;
}


const linkedListData = [11,2,3,4,5];
export default function anyname() {
    return [
        {
            id: "reverse",
            name: "Reverse",
            init: () => linkedListData,
            code: reverseCode,
            fn: () => {
                return reverse(arrayToList(linkedListData));
            }
        },
    ];
}