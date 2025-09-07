//为了能直接修改另外一个组件的状态，而不需要用state (因为修改state会导致重新渲染)
// 两种方法
// 1. 用forwardRef来实现，参考CodeOverlay 通过useImperativeHandle
// 2. 通过extends Component来实现，来暴露setProgress等方法给父组件

import React, { Component, useState , memo, forwardRef} from "react";
import { IconButton, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import Slider from '@mui/material/Slider';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LinearProgress from '@mui/material/LinearProgress';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SyncIcon from '@mui/icons-material/Sync';
class ControlPanel extends Component {
    constructor() {
        console.log("ControlPanel "+window.location.href)
        super();
        this.state = {
            isPlaying:false,
            progress:0,
            isVolumeOn: false
        }
    }
    handlePlayPause = () => {
        //setIsPlaying((prev) => !prev);
        this.setState({
            isPlaying: !this.state.isPlaying,
        });
        console.log("this.state.isPlaying: "+this.state.isPlaying)
        if(this.state.isPlaying) {
            console.log("pausing")
            this.props.playActionByCP("pause")
            console.log("paused")
        } else {
            console.log("playing")
            this.props.playActionByCP("play")
            console.log("playing done")
        }
    };
    handleVolumeOnOff = () => {
        //setIsPlaying((prev) => !prev);
        this.setState({
            isVolumeOn: !this.state.isVolumeOn,
        });
        if(this.state.isVolumeOn) {
            this.props.playActionByCP("off")
        } else {
            this.props.playActionByCP("on")
        }
    };
    play = () => {
        this.setState({
            isPlaying: true,
        });
            console.log("playing")
            this.props.playActionByCP("play")
            console.log("playing done")
    }

    pause = () => {
        this.setState({
            isPlaying: false,
        });
        console.log("pausing")
       this.props.playActionByCP("pause")
       console.log("paused")

    }
    setProgress = (p) => {
        this.setState({
            progress: p
        });
    }
    componentDidMount() {

    }
    render() {
        return (
            <>
             <LinearProgress variant="determinate" value={this.state.progress}/>

            <Box display="flex" alignItems="center" justifyContent="center" gap={1} p={1}>
              {/* First Button */}
                <IconButton color="primary" onClick={() => this.props.playActionByCP("reset")}>
                  <SyncIcon />
                </IconButton>
              {/* First Button */}
              <IconButton color="primary" onClick={() => this.props.playActionByCP("first")}>
                <FirstPageIcon />
              </IconButton>

              {/* Previous Button */}
              <IconButton color="primary" onClick={() => this.props.playActionByCP("previous")}>
                <SkipPreviousIcon />
              </IconButton>

              {/* Play/Pause Button */}
              <IconButton color="primary" onClick={this.handlePlayPause}>
                {this.state.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              {/* Next Button */}
              <IconButton color="primary" onClick={() => this.props.playActionByCP("next")}>
                <SkipNextIcon />
              </IconButton>

              {/* Last Button */}
              <IconButton color="primary" onClick={() => this.props.playActionByCP("last")}>
                <LastPageIcon />
              </IconButton>

                <IconButton color="primary" aria-label="minimize" onClick={this.handleVolumeOnOff} >
                    {this.state.isVolumeOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </IconButton>
            </Box>


            </>
          );
    }
}

export default memo(ControlPanel);