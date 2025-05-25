import { useState, useEffect, useCallback } from 'react';
import { getNotificationsByUser } from '@/services/notification';
import { useUser } from './useUser';
import { AppState } from 'react-native';

export const useNotificationCount = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useUser();

    const fetchUnreadCount = useCallback(async () => {
        if (!user?.id) return;
        try {
            const notifications = await getNotificationsByUser(user.id);
            const unread = notifications.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.log('Error fetching notification count:', error);
        }
    }, [user?.id]);

    // Function to manually update count
    const updateCount = useCallback((increment: number = 0) => {
        setUnreadCount(prev => {
            const newCount = Math.max(0, prev + increment);
            console.log('Updating notification count:', { prev, increment, newCount });
            return newCount;
        });
    }, []);

    // Function to refresh count from server
    const refreshCount = useCallback(async () => {
        await fetchUnreadCount();
    }, [fetchUnreadCount]);

    useEffect(() => {
        // Fetch initial count
        fetchUnreadCount();

        // Listen for app state changes
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                fetchUnreadCount();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [fetchUnreadCount]);

    return { 
        unreadCount, 
        refreshCount,
        updateCount 
    };
}; 