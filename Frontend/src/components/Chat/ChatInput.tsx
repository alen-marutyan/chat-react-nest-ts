import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from './ChatComponent.module.css';
import { ChatInputProps } from '../../interfaces';

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState<string>('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className={styles.inputContainer}>
            <TextField
                placeholder="Type a message..."
                variant="outlined"
                className={styles['input-field']}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
            </IconButton>
        </div>
    );
};

export default ChatInput;
