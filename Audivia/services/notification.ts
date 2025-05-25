import apiClient from "@/utils/apiClient";

interface Notification {
    id: string
    userId: string
    content: string
    type: string
    isRead: boolean
    createdAt: Date
    tourId: string
    timeAgo: string
}

interface UpdateNotificationParams {
    notificationId: string;
    isRead: boolean;
}

interface CreateNotificationParams {
    userId: string
    tourId?: string
    content: string
    type: string
    isRead: boolean
}

export const getNotificationsByUser = async (userId: string) => {
    try {
        const response = await apiClient.get(`/notifications/user/${userId}`)
        return response.data.response
    } catch (error) {
        console.log('Error at notification service: ', error)
        return []
    }
}

export const updateStatusNotification = async ({ notificationId, isRead }: UpdateNotificationParams) => {
    try {
        const response = await apiClient.put(`/notifications/${notificationId}`, { isRead })
        return response.data
    } catch (error) {
        console.log('Error updating notification status: ', error)
        throw error
    }
}

export const createNotification = async (notification: CreateNotificationParams) => {
    try {
        const response = await apiClient.post('/notifications', notification)
        return response.data.response
    } catch (error) {
        console.log('Error creating notification: ', error)
        throw error
    }
}