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
import { useRouter } from "expo-router";
import { register } from "@/services/user";


export default function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter()

  const handleSignup = async () => {
    if( password !== confirmPassword) {
      setMessage("Mật khẩu không khớp")
      return
    }
    setMessage("") // clear message if passwords match
    try {
      const response = await register(username, email, password)
      if(response.success){
        router.push("/signup-success")
      }else {
        setMessage(response.message)
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
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
      colors={[COLORS.light, COLORS.purpleGradient]}
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
          <Ionicons name="person-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="UserName"
            placeholderTextColor={COLORS.grey}
          />
        </View>
        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.grey}
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
        <View style={{marginTop: 5, marginBottom:15, alignItems: 'center'}}>
        {message ? <Text style={{color: 'red'}}>{message}</Text> : null}
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.purpleGradient]}
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

      <View style={styles.footer}>
        <Text>© 2025 Audivia. All rights reserved.</Text>
      </View>
    </View>
  );
}
