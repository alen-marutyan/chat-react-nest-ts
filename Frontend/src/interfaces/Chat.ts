export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'otherUser';
    image: string;
    timestamp: string;
}

export interface ResponseData {
    roomName: string;
    user: {
        username: string;
        image: string;
    }
}
export interface ChatComponentProps {
    currentUser: string;
    onlineUsers: Array<ResponseData>;
    emit: (eventName: string, data: any) => void;
}

export interface ChatInputProps {
    onSendMessage: (message: string) => void;
}