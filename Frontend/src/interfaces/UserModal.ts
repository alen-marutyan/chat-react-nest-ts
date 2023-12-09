export interface UserProfileModalProps {
    isOpen: boolean;
    onSave: (userProfile: { id: string; username: string; image: string }) => void;
    emit: (eventName: string, data: any) => void;
}