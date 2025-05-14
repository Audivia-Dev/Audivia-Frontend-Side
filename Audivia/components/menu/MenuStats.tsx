import { View, Text } from "react-native"
import styles from "@/styles/menu.styles"

export const MenuStats = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>2</Text>
        <Text style={styles.statLabel}>Tours Đã Đi</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>7h</Text>
        <Text style={styles.statLabel}>Tổng Thời Gian</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>2</Text>
        <Text style={styles.statLabel}>Lượt Mua</Text>
      </View>
    </View>
  )
} 