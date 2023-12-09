import React, {useState} from 'react';
import {Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField} from '@mui/material';
import {v4 as uuidv4} from 'uuid';
import {UserProfile, UserProfileModalProps} from "../../interfaces";
import { toast } from 'react-toastify';
const UserProfileModal: React.FC<UserProfileModalProps> = ({emit, isOpen, onSave }) => {
    const [username, setUsername] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>('default_image_url'); // Set a default image URL here

    const handleSave = () => {
        let profile = {
            id: uuidv4(),
            username: username,
            image: imagePreview || 'default_image_url'
        }

        if (!username) {
            toast.error('Please enter a username!');
            return;
        }

        onSave({...profile});
        emit('joinRoom', {roomName: 'roomName', user: profile});
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const maxSizeInBytes = 1024 * 1024; // 1MB
            if (file.size > maxSizeInBytes) {
                toast.error('File size exceeds 1MB. Please choose a smaller file.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <Dialog open={isOpen}>
            <DialogTitle>User Profile</DialogTitle>
            <DialogContent>
                <Box mt={2} textAlign="center">
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        inputProps={{ accept: 'image/*' }}
                        style={{ display: 'none' }}
                        id="image-input"
                    />
                    <Avatar
                        alt="User Avatar"
                        src={imagePreview || 'default_image_url'} // Use the default image URL here
                        sx={{ width: 100, height: 100, margin: '10px auto', display: 'block' }}
                    />
                    <label htmlFor="image-input">
                        <Button
                            component="span"
                            variant="contained"
                            color="primary"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            Choose Image
                        </Button>
                    </label>
                </Box>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserProfileModal;
