import clone from 'clone';
const instructions = [];
const code = `
class Solution {
    public boolean canPlaceFlowers(int[] flowerbed, int n) {
        if(n==0) return true;
        for(int i=0;i<flowerbed.length;i++){
            if(flowerbed[i]==0
                    && (i==0 || flowerbed[i-1]==0) //left is empty
                    && (i==flowerbed.length-1 || flowerbed[i+1]==0)//right is empty
            ) {
                flowerbed[i]=2;
                n--;
                if(n==0) return true;
            }
        }
        return false;
    }
}

`.trim();
function canPlaceFlowers(flowerbed, n) {
    if (n === 0) return true;
    for (let i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] === 0 &&
            (i === 0 || flowerbed[i - 1] === 0) && // left is empty
            (i === flowerbed.length - 1 || flowerbed[i + 1] === 0) // right is empty
        ) {
            flowerbed[i] = 2;
            instructions.push({ commands: [
                { cmd: "ARRAY_HIGHLIGHT_CELL", params: [i]},
            ], 
            description: `plant ` });

            n--;
            if (n === 0) return true;
        }
    }
    return false;
}

const arr = [1,0,1,0,0,0,0,1,0,0,1];

export default () => {
    return [
        {
            id: "a",
            name: "Case 1",
            init: null,
            arrayData: arr,
            code: code,
            fn: () => {
                instructions.length = 0;
                canPlaceFlowers(clone(arr), 2);
                return instructions;
            }
        }
    ];

}

export const arrayEnabled = true;