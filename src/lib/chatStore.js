import { create } from 'zustand';
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set, get) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isRecieverBlocked: false,
    isLoading: true,
    message: '',

    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        if (!currentUser) {
            console.warn("No current user found.");
            return;
        }

        // Check if the current user is blocked by the recipient
        if (user.blocked?.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isRecieverBlocked: false,
            });
        }
        // Check if the recipient is blocked by the current user
        else if(currentUser.blocked?.includes(user.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: false,
                isRecieverBlocked: true,
            });
        } else{
            // Set the chatId and user if no blocking conditions are met
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isRecieverBlocked: false,
            });
        }


    },

    changeBlock: () => {
        set((state) => ({ ...state, isRecieverBlocked: !state.isRecieverBlocked }));
    },
}));
