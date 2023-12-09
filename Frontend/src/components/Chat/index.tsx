import React, {useEffect, useState} from 'react';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import styles from './ChatComponent.module.css';
import {useSocket} from "../../hooks/useSocket";
import ChatInput from "./ChatInput";
import {ChatComponentProps, Message, ResponseData} from '../../interfaces';


const ChatComponent: React.FC<ChatComponentProps> = ({ currentUser, onlineUsers, emit }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useSocket('message', (data: any) => {
        setMessages((prevMessages) => [...prevMessages, {id: data.id, text: data.message, sender: data.username, image: data.image, timestamp: new Date().toLocaleTimeString()}]);
    });

    useSocket('joinedRoom', (data: any) => {
        setMessages(data.messages)
    });

    const handleSendMessage = (message: string) => {
        if (message.trim() !== '') {
            emit('sendMessage', {roomName: 'roomName', message: message});

        }
    };

    useEffect(() => {
        if (!currentUser) {
            emit('disconnect', 'roomName'); // Replace 'roomName' with the actual room name
        }
    }, [emit, currentUser]);

    return (
        <Box className={styles.chatContainer}>
            <Box className={styles['messageContainer']}>
                <List className={styles.messageList}>
                    {messages && messages.map((message) => {
                        return (
                            <ListItem
                                key={message.id}
                                className={ styles[`message-${ (message.id === currentUser) ? 'right' : 'left'}`]}
                            >
                                <ListItemAvatar>
                                    <Typography>{message.sender}</Typography>
                                    <Avatar alt={`${message.sender} Avatar`} src={message.image}/>
                                </ListItemAvatar>
                                <Box className={styles.messageContent}>
                                    <Typography>{message.text}</Typography>
                                    <Typography variant="caption" className={styles.timestamp}>
                                        {message.timestamp}
                                    </Typography>
                                </Box>
                            </ListItem>
                        )
                    })
                    }
                </List>
                <ChatInput onSendMessage={handleSendMessage} />
            </Box>
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
        </Box>
    );
};

export default ChatComponent;
