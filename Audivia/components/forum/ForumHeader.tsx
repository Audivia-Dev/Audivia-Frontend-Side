import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/forum.styles";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";

export const ForumHeader = () => {
  const { user } = useUser();

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Diễn đàn</Text>
      <View style={styles.headerIcons}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={COLORS.dark}
          style={styles.icon}
        />
        <TouchableOpacity
          onPress={() => router.push("/(screens)/message_inbox")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={COLORS.dark}
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={styles.avatarWrapper}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={COLORS.primary}
            />
          )}
        </View>
      </View>
    </View>
  );
}; 