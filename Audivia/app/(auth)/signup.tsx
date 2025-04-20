import { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { Checkbox } from "react-native-paper";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";


export default function Signup() {


  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const {startSSOFlow} = useSSO()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
        const {createdSessionId, setActive} = await startSSOFlow({strategy: "oauth_google"})
        if (setActive && createdSessionId) {
            setActive({session: createdSessionId})
            router.replace("/(tabs)")
        }
    } catch (error) {
        console.error("Error logging in with Google", error)
    }
}


  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
        <MaskedView maskElement={
    <Text style={[styles.brandTitle, { backgroundColor: 'transparent' }]}>
      Audivia
    </Text>
  }>
    <LinearGradient
      colors={[COLORS.light, COLORS.purple]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}>
      <Text style={[styles.brandTitle, { opacity: 0 }]}>
        Audivia
      </Text>
    </LinearGradient>
  </MaskedView>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Đăng Ký</Text>
        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.grey}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputGroup}>
          <Ionicons name="person-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={COLORS.grey}
          />
        </View>
        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            placeholderTextColor={COLORS.grey}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.grey}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={!showPassword}
            placeholderTextColor={COLORS.grey}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.grey}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={() => console.log("Login")}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.loginButtonText}>Đăng Ký</Text>
        </TouchableOpacity>

        <View style={styles.signupWrapper}>
          <Text>Bạn có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signupText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms */}
      <View style={styles.footer}>
        <Text>© 2025 Audivia. All rights reserved.</Text>
      </View>
    </View>
  );
}
