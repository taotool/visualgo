import clone from 'clone';


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

const code = `
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        //even
        //1 2 3 4 x
        //    s   f
        //odd
        //1 2 3 4 5
        //    s   f
        while(fast!=null && fast.next!=null){
            slow = slow.next;
            fast = fast.next.next;
        }
        //if odd, move slow to next;
        if(fast!=null) {
            slow = slow.next;
        }
        //reverse second half;
        ListNode prev = null;
        while(slow!=null){
            ListNode next = slow.next;
            slow.next = prev;
            prev = slow;
            slow = next;
        }

        while(prev!=null){
            if(head.val!=prev.val) return false;
            prev = prev.next;
            head = head.next;
        }
        return true;
    }
`;

function isPalindrome(head) {
    const instructions = [];

    let slow = head;
    let fast = head;
    instructions.push({commands: [
        {cmd: "LIST_UPDATE_POINTER",params:["top1", slow.index, "slow"]},
        {cmd: "LIST_UPDATE_POINTER",params:["top2", fast.index, "fast"]},
        {cmd: "LIST_UPDATE_POINTER",params:["bottom2", head.index, "head"]},
    ], description: `set prev as null`});


    while (fast !== undefined && fast.id != "DUMMY_TAIL" && fast.next !== undefined && fast.next.id != "DUMMY_TAIL") {
        slow = slow.next;
        fast = fast.next.next;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["top1", slow.index, "slow"]},
            {cmd: "LIST_UPDATE_POINTER",params:["top2", fast.index, "fast"]},
        ], description: `set prev as null`});

    }

    if (fast !== undefined && fast.id != "DUMMY_TAIL") {
        slow = slow.next;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["top1", slow.index, "slow"]},
        ], description: `set prev as null`});

    }
    let prev = {id:"DUMMY_HEAD", value: -1, index: slow.index-1};
    instructions.push({commands: [
        {cmd: "LIST_UPDATE_POINTER",params:["top1", prev.index, "prev"]},
        {cmd: "LIST_UPDATE_POINTER",params:["top2", slow.index, "slow"]},
    ], description: `set prev as null`});

    while (slow !== undefined && slow.id != "DUMMY_TAIL") {
        let next = slow.next;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["bottom1", next.index, "next"]},
        ],description: `set next as head.next`});

        slow.next = prev;
        instructions.push({commands: [
            {cmd: "LIST_REVERSE_LINK",params:[slow.id]},
        ], description: `set head's next to prev`});
        instructions.push({commands: [], description: ``});

        prev = slow;
        slow = next;
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["top1", prev.index, "prev"]},
            {cmd: "LIST_UPDATE_POINTER",params:["top2", slow.index, "slow"]},
        ], description: `set prev as head`});

    }

    while (prev !== undefined) {
        instructions.push({commands: [
            {cmd: "LIST_UPDATE_POINTER",params:["top1", prev.index, "prev"]},
            {cmd: "LIST_UPDATE_POINTER",params:["bottom2", head.index, "head"]},
        ], description: `set prev as head`});

        if (head.value !== prev.value) {
            return instructions;
        }
        prev = prev.next;
        head = head.next;
    }


    return instructions;
}



const linkedListData = [1,2,3,4,3,2,1];
export default function anyname() {
    return [
        {
            id: "first",
            name: "Add to First",
            init: () => linkedListData,
            code: code,
            fn: () => {
                return isPalindrome(arrayToList(linkedListData));
            }
        }
    ];
}