const code = "abc";
const treeData = 
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
          "hide": true,
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
          "id": "n5",
          "name": "5",
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
                  "hide": true,
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
            }
          ]
        },
        {
          "id": "n6",
          "name": "6",
          "attributes": {
          },
          "children": [
            {
              "id": "n13",
              "name": "13",
              "attributes": {
              }
            },
            {
              "id": "n14",
              "name": "14",
              "attributes": {
              }
            }
          ]
        }
      ]
    }
  ]
};

export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            params: [treeData],
            init: "this.setState({ data: fn.params[0] });",
            fn: `
                this.popAll();
                this.pollAll();
                const treeData = fn.params[0];
                this.setState({ data: treeData });
            `,
            code: code,
        }
    ];
}