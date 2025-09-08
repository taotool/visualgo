import React, { Component } from 'react';
import * as d3 from 'd3'
import clone from 'clone';

import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";
import { draw2DArray } from "./visualgo/Grid.js";
import CodeOverlay from './visualgo/CodeOverlay.jsx'; // Ensure the path is correct
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';
let icons = [<Filter1Icon/>,<Filter2Icon/>,<Filter3Icon/>,<Filter4Icon/>,<Filter5Icon/>,<Filter6Icon/>,<Filter7Icon/>,<Filter8Icon/>,<Filter9Icon/>];


const data = [
  [ "10,0", "10,1", "10,2", "10,3", "10,4", "10,5", "10,6", "10,7", "10,8", "10,9", "10,10", "10,11", "10,12"],
  [ "11,0", "11,1", "11,2", "11,3", "11,4", "11,5", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12"],
  [ "11,0", "11,1", "11,2", "11,3", "11,4", "11,5", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12"],
  [ "11,0", "11,1", "11,2", "11,3", "11,4", "11,5", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12"],
];

function pacificAtlantic(heights) {
  const result = [];
  const rows = heights.length;
  const cols = heights[0].length;
  //从低处往高处走，反过来找到来源。
  //记录所有能到达pacific的位置
  const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
  //记录所有能到达atlantic的位置
  const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));
  const res = [];
  let p = true;
  // DFS helper
  const dfs = (row, col, visited, prevHeight) => {
    if (
      row < 0 ||
      col < 0 ||
      row >= rows ||
      col >= cols ||
      visited[row][col] ||
      heights[row][col] < prevHeight
    ) {
      return;
    }
    result.push({ action: p?"PRH_N":"POH_N", params: [row, col], i:row, j: col, description: `found a higher place`, result:`${heights[row][col]} >= ${prevHeight}` });
    visited[row][col] = true;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      dfs(row + dr, col + dc, visited, heights[row][col]);
    }
  };

  // Start DFS from edges
  p = true;

  for (let i = 0; i < rows; i++) {
    result.push({ action: "READ", params: [i, 0], i:i, j: 0, description: `Left edge (Pacific) [${i}, ${0}]` });
    dfs(i, 0, pacific, -1); // Left edge (Pacific)
  }

  p = false;
  for (let i = 0; i < rows; i++) {
    
    result.push({ action: "READ", params: [i, cols - 1], i:i, j: 0, description: `Right edge (Atlantic) [${i}, ${cols - 1}]` });
    dfs(i, cols - 1, atlantic, -1); // Right edge (Atlantic)
  }

  p = true;
  for (let j = 0; j < cols; j++) {
    result.push({ action: "READ", params: [0, j], i:0, j: j, description: `Top edge (Pacific) [${0}, ${j}]` });
    dfs(0, j, pacific, -1); // Top edge (Pacific)
  }

  p = false;
  for (let j = 0; j < cols; j++) {
    result.push({ action: "READ", params: [rows - 1, j], i:0, j: j, description: `Bottom edge (Atlantic) [${rows - 1}, ${j}]` });
    dfs(rows - 1, j, atlantic, -1); // Bottom edge (Atlantic)
  }

  // Collect cells that can flow to both oceans
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (pacific[i][j] && atlantic[i][j]) {
        result.push({ action: "HL_N", params: [i, j], i:i, j: j, description: `both` });

        res.push([i, j]);
      }
    }
  }

  return result;
}

function numIslandsDFS(gridIn){
    const result = [];

    function numIslands(grid) {
        let res = 0;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {

                if (grid[i][j] === '1') {
                    result.push({ action: "HL_N", params: [i, j], i:i, j: j, description: `island ${res+1}` });
                    dfs(grid, i, j);
                    res++;
                    //result.push({ action: "READ", params: [i, j], i:i, j: j, description: `Found ${res} ${res>1?"islands":"island"}` });

                }
            }
        }
        return res;
    }

    function dfs(grid, row, col) {
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;
        if (grid[row][col] === '0') return;
        grid[row][col] = '0';
        result.push({ action: "UPD", params: [row, col, '0'], description: `mark it as water` });

        dfs(grid, row - 1, col);
        dfs(grid, row + 1, col);
        dfs(grid, row, col - 1);
        dfs(grid, row, col + 1);
    }
    numIslands(gridIn);
    return result;
}

function minPathCostDFS(gridIn, moveCostIn){
    const result = [];
    function minPathCost(grid, moveCost) {
        let res = 999999;
        const memo = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
        for (let  j = 0;  j < grid[0].length;  j++) {
            res = Math.min(res, dfs(grid, moveCost, 0,  j, memo));
            result.push({ action: "POH_N", params: [0, j, res],  description: `latest min ${res}` });

        }
        result.push({ action: "POH_N", params: [0, grid[0].length-1, res],  description: `global min ${res}` });

        return res;
    }

    function dfs(grid, moveCost, row, col, memo) {//0 row
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return 0;
        if (row === grid.length - 1) {
            result.push({ action: "PRH_N", params: [row+1, col, grid[row][col]],  description: `last row min ${grid[row][col]}` });

            return grid[row][col];
        }
        if (memo[row][col] !== null) {
            result.push({ action: "POH_N", params: [row, col, memo[row][col]],  description: `found cached min ${memo[row][col]}` });

            return memo[row][col];
        }

        let res = 88888;
        const val = grid[row][col];//current v
        result.push({ action: "HL_N", params: [row, col],  description: `checking ${val}` });

        // try all cols
        for (let j = 0; j < grid[0].length;  j++) {
            const cost = moveCost[val][ j]; // 注意是到各子的代价
            result.push({ action: "PRH_N", params: [row + 1, j, cost],  description: `going to check child ${grid[row + 1][j]}` });
            const child = dfs(grid, moveCost, row + 1, j, memo);//
            result.push({ action: "TRY", params: [row + 1,  j, val + cost + child, child],  description: `got child ${child}` });

            res = Math.min(res, val + cost + child);
            result.push({ action: "POH_N", params: [row + 1, j, res],  description: `latest min ${res}` });

        }
        return memo[row][col] = res;
    }

    minPathCost(gridIn, moveCostIn);
    return result;
}



class TGrid extends Component {
    constructor() {
        console.log("algorithms/grids "+window.location.href)
        super();
        this.codeOverlayRef = React.createRef();
    }

    chart = null;
    updateDynamicLabel = (id, i, itext=id) => {
        if(i >= -1) this.chart.updateDynamicLabel(id, i, itext);
    }

    getSupportedAlgorithms2 = () => {
        return [
            /*{id: "a",
            name: "Update Axis Label",
            fn: ()=>{
                this.chart.updateCellClass(2, 5, "");
                this.updateDynamicLabel("i", 1, "1st row");
                this.updateDynamicLabel("j", 7, "7th col");
                this.chart.updateCellClass(1, 7, "highlight");
            }},
            {id: "a1",
            name: "Update Axis Label2",
            fn: ()=>{
               this.chart.updateCellClass(1, 7, "");

                this.updateDynamicLabel("i", 2, "4th row");
                this.updateDynamicLabel("j", 5, "5th col");
                this.chart.updateCellClass(2, 5, "highlight");
            }},
            {id: "b",
            name: "Update Cell Value",
            fn: ()=>{
                this.chart.updateCellValue(1, 2, "[1,2]");
            }},
            {id: "c",
            name: "Highlight Cell Style",
            fn: ()=>{
                this.chart.updateCellClass(1, 2, "highlight");
            }},
            {id: "d",
            name: "Dim Cell Style",
            fn: ()=>{
              this.chart.updateCellClass(1, 2, "posthigh");
            }},
            {id: "e",
            name: "Reset Cell Style",
            fn: ()=>{
              this.chart.updateCellClass(1, 2, "");
            }},*/
            {id: "a",
              name: "Pacific Atlantic",
              fn: ()=>{
                  const dataIn = [
                      [1, 2, 2, 3, 5],
                      [3, 2, 3, 4, 4],
                      [2, 4, 5, 3, 1],
                      [6, 7, 1, 4, 5],
                      [5, 1, 1, 2, 4],
                    ];
                  this.redrawGrid(dataIn);
                return pacificAtlantic(dataIn);
              }},
          {id: "b",
          name: "Num of Islands",
          fn: ()=>{
              const dataIn = [
                ["0","1","0","1","1","0"],
                ["0","1","1","0","1","0"],
                ["0","0","0","0","0","0"],
                ["0","1","1","0","0","0"],
                ["0","0","0","1","0","0"],
                ["0","0","0","0","1","1"],
              ];
              this.redrawGrid(dataIn);
            return numIslandsDFS(dataIn);
          }},
          {id: "e",
          name: "Minimum Path Cost",
          fn: ()=>{
              const dataIn = [[5,3],[4,0],[2,1]];
              const moveCostIn = [[9,8],[1,5],[10,12],[18,6],[2,4],[14,3]];
              this.redrawGrid(dataIn);
            return minPathCostDFS(dataIn, moveCostIn);
          }},
        ];
    };

    getSupportedAlgorithms = () => {
      const res = [];
      if(this.fns) {
      for(let i = 0; i < this.fns.length; i++) {
          const fn = this.fns[i];
          res.push(
              {
                  id: fn.id,
                  name: fn.name,
                  icon: icons[i],
                  fn: () => {
                      this.redrawGrid (fn.params[0]);
                      this.codeOverlayRef.current.setCode(fn.code);
                      return eval(fn.fn);
                  }
              }
          );
      }
      res.push(
          {
              id: "swap",
              name: "Swap 2 cells",
              fn: () => {
                  this.chart.swapCellValues(1, 2, 3, 4);
              }
          }
      );
    }
      return res;
  };
    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "PRH_N":
            this.updateDynamicLabel("r", ins.params[0], "r="+ins.params[0]);
            this.updateDynamicLabel("c", ins.params[1], "c="+ins.params[1]);
            this.chart.updateCellClass(ins.params[0], ins.params[1], "prehigh");
            this.chart.updateCellLT(ins.params[0]-1, ins.params[1], ins.params[2]);

            break;
          case "HL_N":
            this.updateDynamicLabel("i", ins.params[0], "i="+ins.params[0]);
            this.updateDynamicLabel("j", ins.params[1], "j="+ins.params[1]);
            this.chart.updateCellClass(ins.params[0], ins.params[1], "highlight");

            break;
          case "TRY":
            this.updateDynamicLabel("i", ins.params[0], "i="+ins.params[0]);
            this.updateDynamicLabel("j", ins.params[1], "j="+ins.params[1]);
            this.chart.updateCellLB(ins.params[0], ins.params[1], ins.params[2]);
            this.chart.updateCellRT(ins.params[0], ins.params[1], ins.params[3]);
            break;
          case "UPD":
            this.chart.updateCellValue(ins.params[0], ins.params[1], ins.params[2]);
            this.updateDynamicLabel("r", ins.params[0], "r="+ins.params[0]);
            this.updateDynamicLabel("c", ins.params[1], "c="+ins.params[1]);
            this.chart.updateCellClass(ins.params[0], ins.params[1], "posthigh");
            break;
          case "UHL_N":
            this.updateDynamicLabel("i", ins.params[0], "i="+ins.params[0]);
            this.updateDynamicLabel("j", ins.params[1], "j="+ins.params[1]);
            this.chart.updateCellClass(ins.params[0], ins.params[1], "");
            break;
          case "POH_N":
            this.updateDynamicLabel("i", ins.params[0], "i="+ins.params[0]);
            this.updateDynamicLabel("j", ins.params[1], "j="+ins.params[1]);
            this.chart.updateCellClass(ins.params[0], ins.params[1], "posthigh");
            this.chart.updateCellRB(ins.params[0], ins.params[1], ins.params[2]);

            break;
            case "READ":
              this.updateDynamicLabel("i", ins.params[0], "i="+ins.params[0]);
              this.updateDynamicLabel("j", ins.params[1], "j="+ins.params[1]);
  
              break;
          case "HL_R":
            break;
          default:
            console.log("cannot find "+ins.action)
        }
        //console.log("stop instruction "+JSON.stringify(ins));
    }
    render() {
        return (
            <>
            <CodeOverlay ref={this.codeOverlayRef} />
            <div id="grid" className="FlexScrollPaneInFlex" ></div>
            
            </>
        );
    };

    reset = () => {

        this.redrawGrid(data);

    };
    redrawGrid = (dd) => {
              this.chart = draw2DArray("#grid", dd);
              this.updateDynamicLabel("i", -1, "iy-left");
              this.updateDynamicLabel("j", -1, "jx-above");
              panZoom("#grid svg").zoomBy(0.7);
              this.chart.fadeIn();

          };
          loadJsonData = async (id) => {
            
                  const jsModule = await import("./grids/"+id+".js");
                  this.fns = jsModule.getAlgorithms();
  
                  this.props.onNodeClicked("", "", this.getSupportedAlgorithms());
                };
    componentDidMount() {
        console.log("grid did mount")
        // this.loadJsonData("pacific_atlantic");
        this.loadJsonData(this.props.id)

        this.chart = draw2DArray("#grid", data);
        setTimeout(()=>{
            panZoom("#grid svg").zoomBy(0.9);
            this.chart.fadeIn();
        }, 200);

    };

}

export default memo(TGrid);