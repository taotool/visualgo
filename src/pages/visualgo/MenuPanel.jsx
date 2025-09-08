// MediaPlayerControl.js

import { IconButton } from "@mui/material";
import { Component, memo } from "react";

import CloseIcon from '@mui/icons-material/Close';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';


import Stack from '@mui/material/Stack';


import RemoveIcon from '@mui/icons-material/Remove';

class MenuPanel extends Component {
    constructor() {
        console.log("MenuPanel " + window.location.href)
        super();
        this.state = {
            supportedAlgorithms: [],
            title: ""
        }
    }


    setSupportedAlgorithms = (p) => {
        this.setState({
            supportedAlgorithms: p
        });
    }

    // setTitle = (p) => {
    //     this.setState({
    //         title: p
    //     });
    // }
    componentDidMount() {

    }
    render() {
        return (
            <div className="FlexScrollPaneInFlex">
                { this.props.isRight && 
                <Stack spacing={0} direction="row-reverse" sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: "8px",
                    border: '0px solid green'
                }}>
                    <IconButton color="primary" aria-label="Close" onClick={() => this.props.closeByMenu()} >
                        <CloseIcon />
                    </IconButton>

                    <IconButton color="primary" aria-label="Minimize" onClick={() => this.props.minByMenu()}>
                        <RemoveIcon />
                    </IconButton>
                </Stack>
                }

                <div className="FlexScrollPaneInFlex" style={{ border: '0px solid green', }}>
                    <Stack direction="column" spacing={1}
                        sx={{
                            flex: 1,
                            border: '0px solid green',
                            justifyContent: "space-between",
                        }}>
                        <Paper sx={{ width: '100%', maxWidth: '100%' }}>
                            <MenuList dense>
                                {this.state.supportedAlgorithms.map((alg, idx) => (
                                    <Tooltip title={alg.name} >
                                    <MenuItem
                                        key={alg.id}
                                        disabled={alg.disabled}
                                        onClick={(evt) => { this.props.playActionByMenu(alg) }}
                                    >
                                        <ListItemIcon>
                                            {alg.icon}
                                        </ListItemIcon>
                                        <ListItemText>{alg.name}</ListItemText>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>

                                        </Typography>
                                    </MenuItem>
                                    </Tooltip>
                                ))}
                            </MenuList>
                        </Paper>
                    </Stack>
                </div>
            </div>
        );
    }
}

export default memo(MenuPanel);