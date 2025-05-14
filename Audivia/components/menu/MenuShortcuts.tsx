import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import styles from "@/styles/menu.styles"
import { COLORS } from "@/constants/theme"

export const MenuShortcuts = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lối tắt</Text>
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="people-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Bạn bè</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="explore" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Khám phá</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 