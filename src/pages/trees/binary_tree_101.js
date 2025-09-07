import { convertToTree} from './tree_utils';
import clone from 'clone';

function dfsPreOrderR(treeData) {
  
  const result = [];

  function dfs(treeData) {
    if (!treeData) return [];
    result.push(treeData.name);

    const instructions = [];
    //ins.push({ id: "HL_N", params: [treeData.id], description: `Visit '${treeData.name}'` });
    instructions.push(
      {
        commands: [
          { cmd: "HL_N", params: [treeData.id] }
        ],
        description: `Visit and push '${treeData.name}'`
      });
    if (treeData.children) {
      const left = dfs(treeData.children[0]);
      instructions.push(...left);
    }

    if (treeData.children) {
      const right = dfs(treeData.children[1]);
      instructions.push(...right);
    }
    return instructions;
  }
  const instructions = dfs(treeData);

  //ins.push({ id: "R", params: [], description: "Done", result: `'${result}'` });
  instructions.push(
    {
      commands: [
        { cmd: "R", params: [] }
      ],
      description: "Done", 
      result: `'${result}'`
    });
  return instructions;
}
function dfsInOrderR(treeData) {
  const result = [];

  function dfs(treeData) {
    if (!treeData ) return [];

    const instructions = [];
    if (treeData.children) {
      const left = dfs(treeData.children[0]);
      instructions.push(...left);
    }
    result.push(treeData.name);
    instructions.push(
      {
        commands: [
          { cmd: "HL_N", params: [treeData.id] }
        ],
        description: `Visit and push '${treeData.name}'`
      });
    // ins.push({ id: "HL_N", params: [treeData.id], description: `Visiting '${treeData.name}'` });
    if (treeData.children) {
      const right = dfs(treeData.children[1]);
      instructions.push(...right);
    }
    return instructions;
  }
  const instructions = dfs(treeData);
  instructions.push(
    {
      commands: [
        { cmd: "R", params: [] }
      ],
      description: "Done", 
      result: `'${result}'`
    });
  //instructions.push({ id: "R", params: [], description: "Done", result: `'${result}'` });
  return instructions;
}

function dfsPostOrderR(treeData) {
  const result = [];

  function dfs(treeData) {
    if (!treeData ) return [];

    const instructions = [];

    if (treeData.children) {
      const left = dfs(treeData.children[0]);
      instructions.push(...left);
    }

    if (treeData.children) {
      const right = dfs(treeData.children[1]);
      instructions.push(...right);
    }
    result.push(treeData.name);
    // instructions.push({ id: "HL_N", params: [treeData.id], description: `Visiting '${treeData.name}'` });
    instructions.push(
      {
        commands: [
          { cmd: "HL_N", params: [treeData.id] }
        ],
        description: `Visit and push '${treeData.name}'`
      });
    return instructions;
  }
  const instructions = dfs(treeData);

  //instructions.push({ id: "R", params: [], description: "Done", result: `'${result}'` });
  instructions.push(
    {
      commands: [
        { cmd: "R", params: [] }
      ],
      description: "Done", 
      result: `'${result}'`
    });
  return instructions;
}
const PreOrderICode = `
public class BinaryTreeDFSPreOrderA {
	public static void main(String[] args) {
		BinaryTreeNode<String> root = TreeUtils.prepareBinaryTree();
		System.out.println("优化版(书上版)迭代前序遍历，归并了大循环");
		preOrder(root);
	}
	// 优化版前序遍历：访问结点入栈，共用大循环。ABCDEFGH
	public static void preOrder(BinaryTreeNode<String> root) {
		Stack<BinaryTreeNode<String>> stack = new Stack<BinaryTreeNode<String>>();
		BinaryTreeNode<String> element = root;
		while (!stack.isEmpty() || element != null) {//栈非空是为了完成栈里元素，元素若是右节点有可能为空
			if (element != null) {
				System.out.print(element);// 不管三七二十一，先访问根节点，然后再下左路
				stack.push(element);// 凡是入栈的都是已经访问过的，入栈的目的是为了后面察看其右节点
				element = element.getLeft();
			} else {
				element = stack.pop();
				element = element.getRight();// 将“找非空右节点的循环”使用大循环。技巧：归并循环
			}
		}
	}
}
`.trim();

function dfsPreOrderI(treeData) {
  const result = [];
  const instructions = [];

  const stack = [];
  let curr = treeData;
  while ((curr != null) || stack.length > 0) {
    if (curr != null) {//curr is not null
      stack.push(curr);
      //pre-order: visit root first
      result.push(curr.name);
      instructions.push(
        {
          commands: [
            { cmd: "HL_N", params: [curr.id] },
            { cmd: "PUSH", params: [curr.name] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [13] },
            { cmd: "OFFER", params: [curr.name] },

          ],
          description: `Visit and push '${curr.name}'`
        });

      curr = curr.children ? curr.children[0] : null;//left, left, left
    } else {
      curr = stack.pop();
      instructions.push(
        {
          commands: [
            { cmd: "POH_N", params: [curr.id] },
            { cmd: "POP", params: [curr.name] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [17] },
          ],
          description: `Pop '${curr.name}' to check its right child.`
        });

      curr = curr.children ? curr.children[1] : null;//right
    }
  }

  instructions.push(
    {
      commands: [
        { cmd: "R", params: [] }
      ],
      description: "Done", 
      result: `'${result}'`
    });
  return instructions;
}
const InOrderICode = `
public class BinaryTreeDFSInOrderA {
	//4/8/2019
	public static void main(String[] args) {
		BinaryTreeNode<String> root = TreeUtils.prepareBinaryTree();
		System.out.println("最初版（书上版，同前序优化版）中序遍历 （如果是二叉搜索树，中序遍历的结果就是排序的）");
		inOrder(root);
	}
	/////////////////////////////////////////////////////////////
	// 最初版中序遍历。和优化版前序类似 BinaryTreeC
	// CBAFEGDH
	public static void inOrder(BinaryTreeNode<String> root) {
		Stack<BinaryTreeNode<String>> stack = new Stack<BinaryTreeNode<String>>();
		BinaryTreeNode<String> element = root;
		while (!stack.isEmpty() || element != null) {
			if (element != null) {
				stack.push(element);// 先入栈，入栈的目的是为了后面先访问其左节点
				element = element.getLeft();//下到最左
			} else {
				element = stack.pop();
				System.out.print(element);// 从左路返回之后才可以访问自己
				element = element.getRight();// 将“找非空右节点的循环”使用大循环。技巧：归并循环
			}
		}
	}
}
`.trim();
function dfsInOrderI(treeData) {
  const result = [];
  const instructions = [];

  const stack = [];
  let curr = treeData;
  while ((curr != null) || stack.length > 0) {
    if (curr != null) {//curr is not null
      stack.push(curr);
      //instructions.push({ id: "PRH_N", params: [curr.id], pushed: curr.name, description: `Push '${curr.name}'` });
      instructions.push(
        {
          commands: [
            { cmd: "PRH_N", params: [curr.id] },
            { cmd: "PUSH", params: [curr.name] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [16] },
          ],
          description: `Push '${curr.name}'`
        });

      curr = curr.children ? curr.children[0] : null;//left, left, left
    } else {
      curr = stack.pop();
      //in-order: visit the leftmost
      result.push(curr.name);
      //instructions.push({ id: "HL_N", params: [curr.id], popped: curr.name, description: `Visit and pop '${curr.name}' to check its right.` });
      instructions.push(
        {
          commands: [
            { cmd: "HL_N", params: [curr.id] },
            { cmd: "POP", params: [curr.name] },
            { cmd: "OFFER", params: [curr.name] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [20] },
          ],
          description: `Visit and pop '${curr.name}' to check its right.`
        });
      curr = curr.children ? curr.children[1] : null;//right
    }
  }

  instructions.push(
    {
      commands: [
      ],
      description: "Done",
      result: `'${result}'`
    });
  //instructions.push({ id: "R", params: [], description: "Done", result: `'${result}'` });
  return instructions;
}

const PostOrderICode = `
public class BinaryTreeDFSPostOrderA {
    // CBFGEHDA
    public static void postOrder(BinaryTreeNode<String> root) {

        Stack<BinaryTreeNode<String>> stack = new Stack<BinaryTreeNode<String>>();
        stack.push(root);

        while(!stack.isEmpty()) {
            BinaryTreeNode<String> pop = stack.pop();
            System.out.print(pop+" ");//post-order reverse A D H E G F B C
//            if(pop.getRight()!=null) stack.push(pop.getRight()); // pre order A B C D E F G H
            if(pop.getLeft()!=null) 
              stack.push(pop.getLeft());
            if(pop.getRight()!=null) 
              stack.push(pop.getRight());//post order reverse A D H E G F B C
        }

    }
}
`.trim();
function dfsPostOrderI(treeData) {
  const instructions = [];

  const result = [];
  if (treeData === null) return result;
  const stack = [];
  stack.push(treeData);
  while (stack.length > 0) {
    const curr = stack.pop(); // root, right, left
    //instructions.push({ id: "HL_N", params: [curr.id], popped: curr.name, description: `Visit and pop '${curr.name}'` });
    instructions.push(
      {
        commands: [
          { cmd: "HL_N", params: [curr.id] },
          { cmd: "POP", params: [curr.name] },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [10] },
        ],
        description: `Visit and pop '${curr.name}'`
      });
    if (curr.children && curr.children[0]) {

      stack.push(curr.children[0]);
      //instructions.push({ id: "PRH_N", params: [curr.children[0].id], pushed: curr.children[0].name, description: `Push '${curr.children[0].name}'` });
      instructions.push(
        {
          commands: [
            { cmd: "PRH_N", params: [curr.children[0].id] },
            { cmd: "PUSH", params: [curr.children[0].name] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [13] },
          ],
          description: `Push '${curr.children[0].name}'`
        });
    }
    if (curr.children && curr.children[1]) {
      //instructions.push({ id: "PRH_N", params: [curr.children[1].id], pushed: curr.children[1].name, description: `Push '${curr.children[1].name}'` });
      instructions.push(
        {
          commands: [
            { cmd: "PRH_N", params: [curr.children[1].id] },
            { cmd: "PUSH", params: [curr.children[1].name] },
            { cmd: "CODE_HIGHLIGHT_LINE", params: [15] },

          ],
          description: `Push '${curr.children[1].name}'`
        });
      stack.push(curr.children[1]);
    }
    result.unshift(curr.name);
    instructions.push(
      {
        commands: [
          { cmd: "HL_N", params: [curr.id] },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [17] },
          { cmd: "OFFER", params: [curr.name] },

        ],
        description: `Visit '${curr.name}'`
      });

  }
  //instructions.push({ id: "R", params: [], description: "Done", result: `Result '${result}'` });
  instructions.push(
    {
      commands: [
      ],
      description: "Done",
      result: `'${result}'`
    });
  return instructions;
}


function bfsLevelOrder(treeData) {
  const instructions = [];

  const result = [];
  const queue = [];
  queue.push(treeData);//appene to end
  instructions.push(
    {
      commands: [
        { cmd: "PRH_N", params: [treeData.id] },
        { cmd: "OFFER", params: [treeData.name] },
      ],
      description: `Offer '${treeData.name}'`
    });
  while (queue.length > 0) {
    let size = queue.length;
    while(size-->0) {
      const curr = queue.shift(); // poll remove from the first
      result.push(curr.name);
      instructions.push(
        {
          commands: [
            { cmd: "HL_N", params: [curr.id] },
            { cmd: "POLL", params: [curr.name] },
          ],
          description: `Visit and poll '${curr.name}'`
        });
      if (curr.children && curr.children[0]) {
        queue.push(curr.children[0]);//offer
        instructions.push(
          {
            commands: [
              { cmd: "PRH_N", params: [curr.children[0].id] },
              { cmd: "OFFER", params: [curr.children[0].name] },
            ],
            description: `Offer '${curr.children[0].name}'`
          });
      }
      if (curr.children && curr.children[1]) {
        queue.push(curr.children[1]);
        instructions.push(
          {
            commands: [
              { cmd: "PRH_N", params: [curr.children[1].id] },
              { cmd: "OFFER", params: [curr.children[1].name] },
            ],
            description: `Offer '${curr.children[1].name}'`
          });
      }

    }
    instructions.push(
      {
        commands: [
          { cmd: "D", params: [] },
        ],
        description: `Done with current level`,
        result: clone(result)
      });
  }
  instructions.push(
    {
      commands: [
        { cmd: "D", params: [] },
      ],
      description: `Done`,
      result: result
    });
  return instructions;
}
function addNode(treeData) {
  
}
const code = "abc";//, "style": "highlight"

const graphData = {
  "root": "n0",
  "nodes": [
    { "id": "n0", "name": "0" },
    { "id": "n1", "name": "1" },
    { "id": "n3", "name": "3" },
    { "id": "n4", "name": "4" },
    { "id": "n2", "name": "2" },
    { "id": "n5", "name": "5" },
    { "id": "n11", "name": "11" },
    { "id": "n12", "name": "12" },
    { "id": "n15", "name": "15" },
    { "id": "n16", "name": "16" },
    { "id": "n6", "name": "6" },
    { "id": "n13", "name": "13" },
    { "id": "n14", "name": "14" },
    { "id": "n17", "name": "17" },
    { "id": "n18", "name": "18", "style": "hidden" },
    { "id": "n19", "name": "19" , "style": "hidden"},
    { "id": "n20", "name": "20" }
  ],
  "links": [
    { "source": "n0", "target": "n1" },
    { "source": "n0", "target": "n2" },
    { "source": "n1", "target": "n3" },
    { "source": "n1", "target": "n4" },
    { "source": "n2", "target": "n5" },
    { "source": "n2", "target": "n6" },
    { "source": "n5", "target": "n11" },
    { "source": "n5", "target": "n12" },
    { "source": "n12", "target": "n15" },
    { "source": "n12", "target": "n16" },
    { "source": "n6", "target": "n13" },
    { "source": "n6", "target": "n14" },
    { "source": "n14", "target": "n17" },
    { "source": "n14", "target": "n18", "style": "hidden" },
    { "source": "n17", "target": "n19"  , "style": "hidden"},
    { "source": "n17", "target": "n20"  }
  ]
};
const treeData = convertToTree(graphData);
export default function anyname() {
  return [
    {
      id: "dfsPreOrderR",
      name: "Pre Order R",
      params: [graphData],
      init: () => graphData,
      fn: () => {
        return dfsPreOrderR(treeData);
      },
      selected: 0,
      disabled: false
    },
    {
      id: "dfsInOrderR",
      name: "In Order R",
      fn: () => {
        return dfsInOrderR(treeData);
      },
      selected: 0,
      disabled: false
    },
    {
      id: "dfsPostOrderR",
      name: "Post Order R",
      fn: () => {
        return dfsPostOrderR(treeData);
      },
      selected: 0,
      disabled: false
    },

    {
      id: "PreOrder",
      name: "Pre Order I",
      fn: () => {
        return dfsPreOrderI(treeData);
      },
      code: PreOrderICode,
      selected: 0,
      disabled: false
    },
    {
      id: "InOrder",
      name: "In Order I",
      fn: () => {
        return dfsInOrderI(treeData);
      },
      code: InOrderICode,
      selected: 0,
      disabled: false
    },
    {
      id: "PostOrder",
      name: "Post Order I",
      fn: () => {
        return dfsPostOrderI(treeData);
      },
      code: PostOrderICode,
      selected: 0,
      disabled: false
    },
    {
      id: "LevelOrder",
      name: "Level Order",
      fn: () => {
        return bfsLevelOrder(treeData);
      },
      selected: 0,
      disabled: false
    },
    // {
    //   id: "AddNode",
    //   name: "Add Node",
    //   fn: () => {
    //     return addNode(treeData);
    //   },
    //   selected: 0,
    //   disabled: false
    // },
  ];
}

export const treeEnabled = true;
export const queueEnabled = true;
export const stackEnabled = true;
export const arrayEnabled = false;