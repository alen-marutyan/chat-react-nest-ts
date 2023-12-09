import React, {useState} from 'react';
import ChatComponent from './components/Chat';
import UserProfileModal from './components/UserProfileModal';
import {useSocket} from "./hooks/useSocket";
import {ResponseData, UserProfile} from "./interfaces";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App: React.FC = () => {
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Array<ResponseData>>([]);

    const { emit } = useSocket('joinedRoom', (data: any) => {
        setOnlineUsers(data.onlineUsers);
    });

    useSocket('leftRoom', (data: any) => {
        setOnlineUsers(data.onlineUsers);
    });

    const closeUserProfileModal = () => {
        setIsUserProfileModalOpen(false);
    };

    const saveUserProfile = ({ id, username, image }: UserProfile) => {
        const profile = { id, username, image };
        setUserProfile(profile);
        closeUserProfileModal();
    };

    return (
        <>
            {userProfile ? (
                <ChatComponent onlineUsers={onlineUsers} emit={emit} currentUser={userProfile.id}/>
            ) : (
                <UserProfileModal emit={emit} isOpen={isUserProfileModalOpen} onSave={saveUserProfile}/>
            )}
            <ToastContainer />
        </>
    );
};

export default App;