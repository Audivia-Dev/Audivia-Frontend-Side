import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNotificationsByUser, updateStatusNotification } from "@/services/notification";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";
import { useNotificationCount } from "@/hooks/useNotificationCount";

interface Notification {
    id: string
    content: string
    type: string
    isRead: boolean
    createdAt: Date
    tourId: string
    timeAgo: string
    userId: string
}

interface NotificationItemProps extends Notification {
    onPress: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ content, type, isRead, createdAt, tourId, timeAgo, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.item, !isRead && styles.unreadItem]}>
            <Text style={[styles.title, !isRead && styles.unreadText]}>{type}</Text>
            <Text style={[styles.message, !isRead && styles.unreadText]}>{content}</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
    </TouchableOpacity>
);

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useUser()
    const { unreadCount, loadUnreadCount } = useNotificationCount()

    useEffect(() => {
        if (user?.id) {
            fetchNotificationsByUser(user.id)
        }
    }, [user?.id])

    const fetchNotificationsByUser = async (userId: string) => {
        try {
            setIsLoading(true)
            const response = await getNotificationsByUser(userId)
            setNotifications(response || [])
        } catch (error) {
            console.log("Error while fetching notifications ", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleNotificationPress = async (item: Notification) => {
        if (!item.isRead) {
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => 
                    notification.id === item.id 
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            if (item.tourId) {
                router.push(`/detail_tour?tourId=${item.tourId}`)
            } else {
                router.push('/history_transaction')
            }

            try {
                await updateStatusNotification({ 
                    notificationId: item.id, 
                    userId: user?.id as string, 
                    isRead: true 
                });
                
           //     await loadUnreadCount();
            } catch (error) {
                console.log("Error updating notification status:", error);
                setNotifications(prevNotifications => 
                    prevNotifications.map(notification => 
                        notification.id === item.id 
                            ? { ...notification, isRead: false }
                            : notification
                    )
                );
              //  await loadUnreadCount();
            }
        } else {
            if (item.tourId) {
                router.push(`/detail_tour?tourId=${item.tourId}`)
            } else {
                router.push('/history_transaction')
            }
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <NotificationItem {...item} onPress={() => handleNotificationPress(item)} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Thông báo</Text>
            {isLoading ? (
                <View style={styles.centerContent}>
                    <Text>Loading...</Text>
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.centerContent}>
                    <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f6f8fa',
      paddingHorizontal: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        marginBottom: 20
    },
    item: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 12,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
    },
    message: {
      fontSize: 14,
      color: '#555',
      marginTop: 4,
    },
    unreadItem: {
      backgroundColor: '#f0f7ff',
      borderLeftWidth: 3,
      borderLeftColor: '#007AFF',
    },
    unreadText: {
      fontWeight: '700',
    },
    timeAgo: {
      fontSize: 12,
      color: '#888',
      marginTop: 8,
      fontStyle: 'italic',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
  });