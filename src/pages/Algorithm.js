/*

当Route的path为"/algorithms/:alg/:id?"时，显示Algorithm组件

这个文件是一个算法可视化的实现，使用了React框架和一些其他的库。
它包含了一个Algorithm组件，该组件使用Allotment库来创建一个可调整大小的布局，
并在其中嵌入了多个子组件来展示不同的数据结构和算法。

子组件包括图、树、列表、栈、队列、组合、排序和搜索等。
通过alg和id参数来确定要展示的算法和数据结构。

中间：AlgPanel组件用于展示算法面板
下边：StatusPanel组件用于展示状态信息。
下边：ControlPanel组件用于控制算法的执行，
右边或下边：MenuPanel组件用于展示菜单

algPanel和algMap是用来管理不同算法和数据结构的引用和组件。
- 区别在于algMap是一个对象，包含了不同算法和数据结构的引用和组件，而algPanel是一个单独的组件。
- 当且仅当algMap[alg]存在时才返回组件
- 是为了兼容algMap和algPanel的使用
- Txxx组件是用来单独测试具体组件的


*/
import "./Algorithm.css";
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TGraph from './TGraph';
import TTree from './TTree';
import TList from './TList';
import TGrid from './TGrid';
import TStack from './TStack';
import TQueue from './TQueue';
import TCombo from './TCombo';
import TSorting from './TSorting';
import TSearching from './TSearching';
import TArray from './TArray';
import AlgPanel from "./AlgPanel";
import ControlPanel from './ControlPanel';
import MenuPanel from './MenuPanel';
import StatusPanel from './StatusPanel';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import * as React from 'react';
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CodeOverlay from './CodeOverlay'; // Ensure the path is correct
import * as d3 from "d3";

console.log("######### Algorithm.js ######### ");
const isSpeechRecognitionAvailable = (typeof window.SpeechRecognition !== "undefined" || typeof window.webkitSpeechRecognition !== "undefined");




function Algorithm() {
    let isVolumeOn = false;
    let isPlaying = false;
    function setIsPlaying(p) {
        isPlaying = p;
    }
    const { alg, id } = useParams();
    console.log("alg " + alg + " == " + window.location.href + ", " + id);
    const vSplitRef = useRef();
    const hSplitRef = useRef();
    const controlPanelRef = useRef();
    const statusPanelRef = useRef();
    const rightMenuPanelRef = useRef();
    const bottomMenuPanelRef = useRef();
    const codeOverlayRef = useRef();
    const treesRef = useRef();
    const gridsRef = useRef();
    const stacksRef = useRef();
    const barsRef = useRef();
    const listsRef = useRef();
    const arraysRef = useRef();
    const queuesRef = useRef();
    const combosRef = useRef();
    const algPanelRef = useRef();
    const graphsRef = useRef();
    const playActionByMenu = useCallback((algItem) => {
        instructions = [];
        currIdx = 0;
        //instructions = getAlgRef().current.record(algItem.id);
        instructions = algItem.fn();
        if (instructions) {
            codeOverlayRef.current.setCode(algItem.code);
            controlPanelRef.current.play();
        }
    }, []);
    const algPanel = <AlgPanel 
        ref={algPanelRef}
        playAction={playActionByMenu}
        onNodeClicked={(sa) => { setSupportedAlgorithms(sa); }}
        alg={alg}
        id={id}
    />;
    const algMap = {
        "ttrees": {
            ref: treesRef,
            component: <TTree ref={treesRef}
                onNodeClicked={(d3node, evt, sa) => { setSupportedAlgorithms(sa); }}
                id={id}
            />
        },
        "tgrids": {
            ref: gridsRef,
            component: <TGrid ref={gridsRef}
                onNodeClicked={(node, evt, sa) => { setSupportedAlgorithms(sa); }}
                id={id} />
        },
        "tstacks": {
            ref: stacksRef,
            component: <TStack ref={stacksRef} onNodeClicked={(node, evt, sa) => {
                console.log("grid cell is clicked " + node + ", " + evt + ", " + sa)
                setSupportedAlgorithms(sa)

            }} />
        },
        "tsorting": {
            ref: barsRef,
            component: <TSorting ref={barsRef} onNodeClicked={(node, evt, sa) => {
                console.log("bar is clicked " + node + ", " + evt + ", " + sa)
                setSupportedAlgorithms(sa)

            }} />
        },
        "tsearching": {
            ref: barsRef,
            component: <TSearching ref={barsRef} onNodeClicked={(node, evt, sa) => {
                console.log("bar is clicked " + node + ", " + evt + ", " + sa)
                setSupportedAlgorithms(sa)

            }} />
        },
        "tlists": {
            ref: listsRef,
            component: <TList ref={listsRef} onNodeClicked={(node, evt, sa) => {
                console.log("list node is clicked " + node + ", " + evt + ", " + sa)
                setSupportedAlgorithms(sa)

            }} />
        },
        "tarrays": {
            ref: arraysRef,
            component: <TArray ref={arraysRef} onNodeClicked={(node, evt, sa) => {
                console.log("array cell is clicked " + node + ", " + evt + ", " + sa)
                setSupportedAlgorithms(sa)

            }} />
        },
        "tqueues": {
            ref: queuesRef,
            component: <TQueue ref={queuesRef}
                onNodeClicked={(d3node, evt, sa) => { setSupportedAlgorithms(sa); }}
                id={id}
            />
        },
        "tcombos": {
            ref: combosRef,
            component: <TCombo ref={combosRef}
                onNodeClicked={(d3node, evt, sa) => { setSupportedAlgorithms(sa); }}
                id={id}
            />
        },
        "tgraphs": {
            ref: graphsRef,
            component: <TGraph ref={graphsRef} onNodeClicked={(node, event, sa) => {
                console.log("graph node is clicked " + node + ", " + event + ", " + sa)
                setSupportedAlgorithms(sa)

            }}
                id={id}
            />
        },
    };


    //    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate(); // Get the navigate function const navigate = () => {}
    let instructions = [];
    let timeout = 0;
    let currIdx = 0;
    let defaultAlgorithm = null;
    let stepping = false;

    const setSupportedAlgorithms = (ss) => {
        defaultAlgorithm = ss[0];
        rightMenuPanelRef.current.setSupportedAlgorithms(ss);
        bottomMenuPanelRef.current.setSupportedAlgorithms(ss);

        // rightMenuPanelRef.current.setTitle(alg+" "+id);
        // bottomMenuPanelRef.current.setTitle(alg+" "+id);
    }

    //You can't add the ref attribute to functional component
    //https://legacy.reactjs.org/docs/refs-and-the-dom.html#refs-and-function-components
    //react-dom.development.js:86 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
    const Alg = useCallback(() => {
        const a = algMap[alg];
        if (a) return a.component;//当且仅当algMap[alg]存在时才返回组件

        return algPanel;
    }, [alg]);//if alg changes, recreate -- for switching between different menus


    const getAlgRef = () => {
        const a = algMap[alg];
        if (a) return a.ref;
        return algPanelRef;
    }
    const first = useCallback(() => {
        getAlgRef().current.reset();
        currIdx = 0;
   
        controlPanelRef.current.setProgress(0);
        codeOverlayRef.current.highlightLine(0);
        statusPanelRef.current.setStatus("");
        if (isPlaying)
            controlPanelRef.current.pause();
    }, []);
    const previous = useCallback(() => {
        getAlgRef().current.reset();
        if (currIdx > -1) currIdx--;
        if (currIdx == -1) return;
        getAlgRef().current.execTo(instructions, 0, currIdx);
        codeOverlayRef.current.highlightLine(instructions[currIdx].line);
        statusPanelRef.current.setStatus(instructions[currIdx].description);
        let pro = (currIdx + 1) * 100 / instructions.length;
        //setProgressState(pro);//如何避免刷新，不要用state，如果要更新子元素的状态，定义一个，直接调用
        controlPanelRef.current.setProgress(pro);
        if (isPlaying)
            controlPanelRef.current.pause();

    }, []);

    const next = useCallback(() => {
        // getAlgRef().current.reset();
        if(currIdx >= instructions.length-1) return;
        if (currIdx < instructions.length-1) currIdx++;

        getAlgRef().current.execTo(instructions, currIdx, currIdx);
        codeOverlayRef.current.highlightLine(instructions[currIdx].line);
        statusPanelRef.current.setStatus(instructions[currIdx].description);
        let pro = (currIdx + 1) * 100 / instructions.length;
        //setProgressState(pro);//如何避免刷新，不要用state，如果要更新子元素的状态，定义一个，直接调用
        controlPanelRef.current.setProgress(pro);
        if (isPlaying)
            controlPanelRef.current.pause();

    }, []);
    const last = useCallback(() => {
        if (isPlaying)
            controlPanelRef.current.pause();
        getAlgRef().current.execTo(instructions, currIdx+1, instructions.length - 1);
        currIdx = instructions.length - 1;
        statusPanelRef.current.setStatus(instructions[currIdx].description);
        controlPanelRef.current.setProgress(100);
        codeOverlayRef.current.highlightLine(instructions[currIdx].line);

    }, []);
    const reset = useCallback(() => {
        instructions = [];
        currIdx = 0;
        controlPanelRef.current.setProgress(0);
        statusPanelRef.current.setStatus("");

        window.speechSynthesis.cancel();
        getAlgRef().current.reset();
        controlPanelRef.current.pause();

    }, []);



    const playActionByCP = useCallback((act) => {
        
        if(instructions.length==0) {
            currIdx = 0;
            instructions = defaultAlgorithm.fn();
        }
       playAction(act);
    }, []);


    const playAction = useCallback((act) => {
        const currentAlgRef = getAlgRef();
        if (currentAlgRef == null || currentAlgRef.current == null) return;

        switch (act) {
            case "reset":
                reset();
                break;
            case "first":
                first();
                break;
            case "previous":
                stepping = true;

                previous();
                stepping = false;
                break;
            case "play":
                setIsPlaying(true)
                play(instructions);
                break;
            case "pause":
                setIsPlaying(false)
                window.speechSynthesis.cancel();
                break;
            case "next":
                // stepping = true;
                // play(instructions);
                // stepping = false;
                next();
                break;
            case "last":
                last();
                break;
            case "on":
                isVolumeOn = true;
                break;
            case "off":
                isVolumeOn = false;
                window.speechSynthesis.cancel();
                play(instructions);
                break;
        }
    }, [alg]);

    

    const play = useCallback((instructions) => {
        if (currIdx < 0) currIdx = 0;
        const currentAlgRef = getAlgRef();
        if (currentAlgRef == null || currentAlgRef.current == null) return;
        if (instructions.length == 0 || currIdx >= instructions.length) {
            setIsPlaying(false);
            controlPanelRef.current.pause();
            return
        };

        if (!isPlaying && !stepping) {
            return;
        }
        const ins = instructions[currIdx];
        timeout = ins.id == "SWAP" ? 1100 : 1000;
        codeOverlayRef.current.highlightLine(instructions[currIdx].line);
        statusPanelRef.current.setStatus(ins.description + (ins.result ? " " + ins.result : ""));
        let pro = (currIdx + 1) * 100 / instructions.length;
        //setProgressState(pro);//如何避免刷新，不要用state，如果要更新子元素的状态，定义一个，直接调用
        controlPanelRef.current.setProgress(pro);

        currentAlgRef.current.exec(ins);
        currIdx++;
        if (stepping) {
            return;
        }
        if (isVolumeOn && isSpeechRecognitionAvailable && ins.description) {
            const availableVoices = window.speechSynthesis.getVoices();

            const utterance = new SpeechSynthesisUtterance(ins.description);
            utterance.onend = () => {
                //console.log("Speech finished!");
                play(instructions);
            };
            window.speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => {
                play(instructions);
            }, timeout);
        }

    }, []);
    const closeByMenu = () => {
        //        navigate("/algorithms");
        navigate(-1);

    }
    const minimizeRight = () => {
        hSplitRef.current.resize([200, 2111, 53]);
    }
    const minimizeBottom = () => {
        vSplitRef.current.resize([200, 2111, 40]);
    }
    const minWidth = 52;
    const [splitState, setSplitState] = useState(
        {
            hSplitPaneLeft:
            {
                minSize: 0,
                maxSize: 0,
                preferredSize: 0,
            },
            hSplitPaneRight:
            {
                minSize: 0,
                maxSize: 200,
                preferredSize: 53,
            },
            vSplitPaneBottom:
            {
                minSize: 0,
                maxSize: 0,
                preferredSize: 0,
            }
        }
    );
    const getScreenOrientation = () => {
        let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        //let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (screenWidth < 600) {
            setSplitState(
                {
                    hSplitPaneLeft:
                    {
                        minSize: 0,
                        maxSize: 0,
                        preferredSize: 0,
                    },
                    hSplitPaneRight:
                    {
                        minSize: 1,
                        maxSize: 1,
                        preferredSize: 1,
                    },
                    vSplitPaneBottom:
                    {
                        minSize: 4,
                        maxSize: 200,
                        preferredSize: 100,
                    }
                }
            );
        } else if (screenWidth < 800) {
            setSplitState(
                {
                    hSplitPaneLeft:
                    {
                        minSize: 0,
                        maxSize: 0,
                        preferredSize: 0,
                    },
                    hSplitPaneRight:
                    {
                        minSize: minWidth,
                        maxSize: minWidth,
                        preferredSize: minWidth,
                    },
                    vSplitPaneBottom:
                    {
                        minSize: 0,
                        maxSize: 0,
                        preferredSize: 0,
                    }
                }
            );
        } else {
            setSplitState(
                {
                    hSplitPaneLeft:
                    {
                        minSize: 0,
                        maxSize: 0,
                        preferredSize: 0,
                    },
                    hSplitPaneRight:
                    {
                        minSize: minWidth,
                        maxSize: minWidth,
                        preferredSize: minWidth,
                    },
                    vSplitPaneBottom:
                    {
                        minSize: 0,
                        maxSize: 0,
                        preferredSize: 0,
                    }
                }
            );
        }
        //        if(vSplitRef.current!=null && hSplitRef.current!=null) {
        //            if(screenWidth<600) {
        //                hSplitRef.current.resize([1110, 0])
        //                vSplitRef.current.resize([410, 100])
        //            } else if(screenWidth<800) {
        //                hSplitRef.current.resize([500, 52])
        //                vSplitRef.current.resize([10000, 0])
        //            } else {
        //                hSplitRef.current.resize([10000, 52])
        //                vSplitRef.current.resize([10000, 0])
        //            }
        //        }
        // fadeIn();
    }
    const getScreenOrientation2 = () => {
        let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        
        if(vSplitRef.current!=null && hSplitRef.current!=null) {
            if(screenWidth<600) {
                hSplitRef.current.resize([0, 10000, 0])
                vSplitRef.current.resize([410, 100])
            } else if(screenWidth<800) {
                hSplitRef.current.resize([0, 10000, 52])
                vSplitRef.current.resize([10000, 0])
            } else {
                hSplitRef.current.resize([100,1000, 52])
                vSplitRef.current.resize([10000, 0])
            }
        }
    }

    const fadeOut = () => {
        document.querySelector("#splitPane").classList.add('fade-out');
    };

    const fadeIn = () => {
        document.querySelector("#splitPane").classList.add('fade-in');
    };

    useEffect(() => {
        fadeOut();
        //fixme: this will refresh this page, everything will be recreated
        getScreenOrientation();
        setSupportedAlgorithms(getAlgRef().current.getSupportedAlgorithms());

        window.addEventListener('resize', getScreenOrientation);
        setTimeout(() => { fadeIn(); }, 1);
    }, [])
    // algPanelRef.current && algPanelRef.current.fit();
    return (
        <Allotment ref={hSplitRef} id="splitPane"
        onChange={() => {
            console.log("alg change");
          }}
        >
            <Allotment.Pane minSize={splitState.hSplitPaneLeft.minSize} maxSize={splitState.hSplitPaneLeft.maxSize} preferredSize={splitState.hSplitPaneLeft.preferredSize} >
                <CodeOverlay ref={codeOverlayRef} />
            </Allotment.Pane>

            <Allotment.Pane minSize={300}>{/*center pane*/}
                <Allotment vertical={true} ref={vSplitRef}>
                    {/*graph pane*/}
                    <Allotment.Pane minSize={200} >
                        {splitState.hSplitPaneRight.maxSize==1
                         && 
                        <Stack style={{position:'absolute', top:4, left:12, zIndex:1000}}>
                            <IconButton color="primary" aria-label="minimize" onClick={()=>navigate(-1)} >
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Stack>
                        }
                        <div className="FlexScrollPaneInFlex">

                            <Alg />
                            <ControlPanel ref={controlPanelRef} playActionByCP={playActionByCP} />
                        </div>

                        <Stack style={{ position: 'absolute', bottom: 50, zIndex: 1000, border: '0px solid green', width: '100%' }} p={1}>
                            <StatusPanel ref={statusPanelRef} />
                        </Stack>
                    </Allotment.Pane>

                    {
                        /*graph pane below
                        <Allotment.Pane className="vSplitPaneBottom" >snap
                        */
                    }
                    <Allotment.Pane minSize={splitState.vSplitPaneBottom.minSize} maxSize={splitState.vSplitPaneBottom.maxSize} preferredSize={splitState.vSplitPaneBottom.preferredSize}  >
                        <MenuPanel ref={bottomMenuPanelRef} playActionByMenu={playActionByMenu} minByMenu={minimizeBottom} closeByMenu={closeByMenu} />
                    </Allotment.Pane>
                </Allotment>
            </Allotment.Pane>
            {/*graph pane right
        <Allotment.Pane className="hSplitPaneRight" >snap
        */}
            <Allotment.Pane minSize={splitState.hSplitPaneRight.minSize} maxSize={splitState.hSplitPaneRight.maxSize} preferredSize={splitState.hSplitPaneRight.preferredSize} >
                <MenuPanel ref={rightMenuPanelRef} isRight={true} playActionByMenu={playActionByMenu} minByMenu={minimizeRight} closeByMenu={closeByMenu} />
            </Allotment.Pane>
        </Allotment>
    );
}

export default memo(Algorithm)