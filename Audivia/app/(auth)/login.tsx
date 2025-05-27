import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import { login } from "@/services/user";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        router.replace('/(auth)/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleLogin = async (email: string, password: string, _username: string) => {
    try {
      const response = await login(email, password);
      if (response.accessToken && response.refreshToken) {
        await authLogin(response.accessToken, response.refreshToken);
        alert(response.message);
      } 
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Google Login")
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

      <AuthForm
        type="login"
        onSubmit={handleLogin}
        onGoogleAuth={handleGoogleLogin}
        onForgotPassword={() => console.log("Forgot password")}
        onToggleAuth={() => router.push("/signup")}
      />

      {/* Terms */}
      <View style={styles.footer}>
        <Text>© 2025 Audivia. All rights reserved.</Text>
      </View>
    </View>
  );
}