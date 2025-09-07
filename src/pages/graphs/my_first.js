
export default function alg () {
    const jsonData = {
                 "type": "undirected",
                 "nodes": [
                   { "id": "n0", "name": "N0" },
                   { "id": "n1", "name": "N1" },
                   { "id": "n2", "name": "N2" },
                   { "id": "n3", "name": "N3" },
                   { "id": "n4", "name": "N4" },
                   { "id": "n5", "name": "N5" }
                 ],
                 "edges": [
                   { "source": "n0", "target": "n1", "weight": "1" },
                   { "source": "n0", "target": "n2", "weight": "4" },
                   { "source": "n1", "target": "n2", "weight": "4" },
                   { "source": "n1", "target": "n3", "weight": "2" },
                   { "source": "n1", "target": "n4", "weight": "7" },
                   { "source": "n2", "target": "n3", "weight": "3" },
                   { "source": "n2", "target": "n4", "weight": "5" },
                   { "source": "n3", "target": "n4", "weight": "4" },
                   { "source": "n3", "target": "n5", "weight": "6" },
                   { "source": "n4", "target": "n5", "weight": "7" }
                 ]
               }
    function test () {
        console.log("my sec test")
    }


    function getAlgorithms () {
        return [
            {id: "dfs",
            name: "DFS Traversal",
            fn: "traverseGraphDFS(jsonData,'a1')",
            selected: 0,
            disabled: false
            },
            {
                id: "bfs",
                name: "BFS Traversal",
                fn: "traverseGraphBFS(jsonData)",
                selected: 0,
                disabled: false
            },
              {
                  id: "detectCycle",
                  name: "Detect Cycle",
                  fn: "detectCycle(jsonData)",
                  code: "detectcycle",
                  selected: 0,
                  disabled: false
              },
             {
                 id: "topsort",
                 name: "Top Sort",
                 fn: "topSort(jsonData)",
                 code: "topsort",
                 selected: 0,
                 disabled: false
             }
        ];

    }


      return Object.assign(this, {
        jsonData,
        test,
        getAlgorithms,
      });
}