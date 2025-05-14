import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import styles from '@/styles/home.styles';

export const Header = () => {
  const { user } = useUser();

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Trang chủ</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.dark} style={styles.icon} />
          <TouchableOpacity onPress={() => router.push('/(screens)/message_inbox')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.dark} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.avatarWrapper}>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user?.avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
            )}
          </View>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={18} color="#000" />
        <Text style={styles.locationText}>Thu Duc, HCM</Text>
      </View>
    </View>
  );
}; 