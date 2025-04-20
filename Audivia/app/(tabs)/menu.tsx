import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import styles from "@/styles/menu.styles"
import { COLORS } from "@/constants/theme"
import { router } from "expo-router"
import { useAuth } from "@clerk/clerk-expo"

export default function MenuScreen() {
  const { signOut } = useAuth()

  const navigateToProfile = () => {
    router.push("/profile")
  }
  const navigateToWallet = () => {
    router.push("/history_transaction")
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace("/(auth)/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>

          <TouchableOpacity onPress={navigateToProfile}>
            <View style={styles.headerContent}>
              <Image
              source={
                require("@/assets/images/avatar.jpg")
              }
              style={styles.avatar}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.userName}>Tina Pham</Text>
              <Text style={styles.viewProfile}>Xem trang cá nhân của bạn</Text>
            </View>
          </View>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
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

        {/* Shortcuts Section */}
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

        {/* My Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
          <View style={styles.menuGroup}>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="time-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.menuText}>Lịch sử tour</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="cart-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.menuText}>Lịch sử mua hàng</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={navigateToWallet}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="wallet-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.menuText}>Ví của tôi</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
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

        {/* Help & Feedback Section */}
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

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Audivia © 2025</Text>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

