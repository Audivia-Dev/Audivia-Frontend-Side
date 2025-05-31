import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import { login } from "@/services/user";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/common/AuthForm";

export default function Login() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

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
      {/* Circular Background Shape */}
      <View style={styles.circleTopShape} />
      {/* Logo */}
      <View style={styles.logoSection}>
        <MaskedView maskElement={
          <Text style={[styles.brandTitle, { backgroundColor: 'transparent' }]}>
            Đăng Nhập
          </Text>
        }>
          <LinearGradient
            colors={[COLORS.light, COLORS.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={[styles.brandTitle, { opacity: 0 }]}>
              Đăng Nhập
            </Text>
          </LinearGradient>
        </MaskedView>
        <Image source={{ uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748432785/Audivia/mwxl1jfedjmj7lc0luth.png' }} style={styles.logo} />
      </View>

      <AuthForm
        type="login"
        onSubmit={handleLogin}
        onGoogleAuth={handleGoogleLogin}
        onForgotPassword={() => console.log("Forgot password")}
        onToggleAuth={() => router.push("/signup")}
      />
    </View>
  );
}