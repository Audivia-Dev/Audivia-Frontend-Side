import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "@/styles/menu.styles"
import { COLORS } from "@/constants/theme"

export const MenuHelp = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trợ giúp & Phản hồi</Text>
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Về Audivia</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Trợ giúp & Phản hồi</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
} 