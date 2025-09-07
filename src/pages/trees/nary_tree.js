
const code = "abc";
const root = 
{
  "id": "n0",
  "name": "0",
  "attributes": {
  },
  "children": [
    {
      "id": "n1",
      "name": "1",
      "attributes": {
      },
      "children": [
        {
          "id": "n3",
          "name": "3",
          "attributes": {
          }
        },
        {
          "id": "n4",
          "name": "4",
          "attributes": {
          }
        },
        {
          "id": "n5",
          "name": "5",
          "attributes": {
          }
        }
      ]
    },
    {
      "id": "n2",
      "name": "2",
      "attributes": {
      },
      "children": [
        {
          "id": "n6",
          "name": "6",
          "attributes": {
          },
          "children": [
            {
              "id": "n11",
              "name": "11",
              "attributes": {
              }
            },
            {
              "id": "n12",
              "name": "12",
              "attributes": {
              },
              "children": [
                {
                  "id": "n15",
                  "name": "15",
                  "attributes": {
                  }
                },
                {
                  "id": "n16",
                  "name": "16",
                  "attributes": {
                  }
                }
              ]
            },
            {
              "id": "n13",
              "name": "13",
              "attributes": {
              }
            }
          ]
        }
      ]
    }
  ]
}
;

export default function anyname() {
    return [
        {
          id: "dfsPreOrderR",
          name: "Pre Order R",
          params: [root],
          init: "fn.params[0]",
          fn: (that) => {
            return that.dfsPreOrderR(root);
          },
          selected: 0,
          disabled: false
        },
        {
          id: "dfsInOrderR",
          name: "In Order R",
          fn: (that) => {
               return that.dfsInOrderR(root);
          },
          selected: 0,
          disabled: false
        },
        {
          id: "dfsPostOrderR",
          name: "Post Order R",
          fn: (that) => {
               return that.dfsPostOrderR(root);
          },
          selected: 0,
          disabled: false
        },

       {
          id: "PreOrder",
          name: "Pre Order I",
          fn: (that) => {
               return that.dfsPreOrderI(root);
          },
          selected: 0,
          disabled: false
        },
        {
          id: "InOrder",
          name: "In Order I",
          fn: (that) => {
               return that.dfsInOrderI(root);
          },
          selected: 0,
          disabled: false
        },
        {
          id: "PostOrder",
          name: "Post Order I",
          fn: (that) => {
              return that.dfsPostOrderI(root);
          },
          selected: 0,
          disabled: false
        },
    ];
}