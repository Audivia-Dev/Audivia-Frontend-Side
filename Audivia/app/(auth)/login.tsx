import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/auth.styles";
import { COLORS } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import { login, loginWithGoogle } from "@/services/user";
import { useAuth } from "@/contexts/AuthContext";

import AuthForm from "@/components/AuthForm";
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { useEffect } from "react";

export default function Login() {

  const webClientId  = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
  
  WebBrowser.maybeCompleteAuthSession();
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId,
    iosClientId,
    androidClientId
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("access token", token);
      // TODO: Send token to your backend
    }
  }, [response]);

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
    try {
      console.log("Starting Google Login...");
      const result = await promptAsync();
      console.log("Google login result:", result);
      if (result.type === "success") {
        const { authentication } = result;
        const token = authentication?.accessToken;
        console.log("Google login success", token);
        
        if (!authentication?.accessToken) {
          throw new Error("No access token received from Google");
        }
        
        const backendResponse = await loginWithGoogle(authentication.accessToken);
        if (backendResponse.accessToken && backendResponse.refreshToken) {
         await authLogin(backendResponse.accessToken, backendResponse.refreshToken);
         alert('Đăng nhập Google thành công');
         // Điều hướng user sau khi đăng nhập thành công
          // router.replace('/'); // Ví dụ: điều hướng về trang chính
        } else {
         alert("Google login successful but backend failed to issue app tokens.");
        }

      } else if (result?.type === 'cancel') {
        console.log("Google login cancelled");
        // alert("Đăng nhập Google đã bị hủy");
      } else if (result?.type === 'dismiss') {
         console.log("Google login dismissed");
         // alert("Đăng nhập Google đã bị đóng");
      } else {
         console.log("Google login failed with type:", result?.type);
         alert("Đăng nhập Google thất bại");
      }

      



    } catch (error) {
      console.error("Google login error:", error);
    }
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
        onForgotPassword={() => router.push("/forgot-password")}
        onToggleAuth={() => router.push("/signup")}
      />
    </View>
  );
}