import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import styles from "@/styles/menu.styles"
import { useAuth } from "@/contexts/AuthContext"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { MenuStats } from "@/components/menu/MenuStats"
import { MenuShortcuts } from "@/components/menu/MenuShortcuts"
import { MenuAccount } from "@/components/menu/MenuAccount"
import { MenuHelp } from "@/components/menu/MenuHelp"
import { MenuPreferences } from "@/components/menu/MenuPreferences"

export default function MenuScreen() {
  const { logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MenuHeader />
        <MenuStats />
        <MenuShortcuts />
        <MenuAccount />
        <MenuPreferences />
        <MenuHelp />

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

