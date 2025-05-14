import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/menu.styles"
import { COLORS } from "@/constants/theme"

export const MenuPreferences = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tùy chọn</Text>
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Cài đặt tùy chọn</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="moon-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Chế độ tối</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 