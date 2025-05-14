import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import { register } from "@/services/user";
import AuthForm from "@/components/AuthForm";
export default function Signup() {
  const router = useRouter();

  const handleSignup = async (email: string, password: string, username?: string) => {
    if (!username) {
      alert("Vui lòng nhập tên người dùng");
      return;
    }
    try {
      const response = await register(username, email, password);
      if (response.success) {
        alert(response.message);
        router.push("/signup_success");
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    console.log("Google Signup")
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
        type="signup"
        onSubmit={handleSignup}
        onGoogleAuth={handleGoogleSignup}
        onToggleAuth={() => router.push("/login")}
      />

      {/* Terms */}
      <View style={styles.footer}>
        <Text>© 2025 Audivia. All rights reserved.</Text>
      </View>
    </View>
  );
}
