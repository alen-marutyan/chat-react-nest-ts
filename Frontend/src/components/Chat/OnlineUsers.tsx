import React from 'react';
import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import styles from "./ChatComponent.module.css";
import {ResponseData} from "../../interfaces";

const OnlineUsers = ({onlineUsers}: {onlineUsers: Array<ResponseData>}) => {
    return (
        <Box className={styles.onlineUsers}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Online Users
            </Typography>
            <List>
                {onlineUsers && onlineUsers.map((data: ResponseData) => (
                    <ListItem key={data.user.username}>
                        <ListItemAvatar>
                            <Avatar alt={`Avatar`} src={data.user.image} />
                        </ListItemAvatar>
                        <ListItemText primary={data.user.username} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default OnlineUsers;