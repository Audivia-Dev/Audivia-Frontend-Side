import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";
import { useNotificationCount } from "@/hooks/useNotificationCount";



export const NotificationButton = () => {
    const { unreadCount } = useNotificationCount();

    return (
        <TouchableOpacity
            onPress={() => {
                console.log('Notification button pressed');
                router.push("/(screens)/notifications");
            }}
        >
            <View style={{ position: 'relative' }}>
                <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={COLORS.dark}
                    style={{ position: 'relative' }}
                />
                {unreadCount > 0 && (
                    <View style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        backgroundColor: COLORS.red,
                        borderRadius: 10,
                        minWidth: 18,
                        height: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 4,
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 'bold',
                        }}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}; 