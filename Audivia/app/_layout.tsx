import { COLORS } from '@/constants/theme';
import '../global.css';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import InitialLayout from '@/components/InitialLayout';
import FloatingButton from "../components/FloatingButton";

export default function RootLayout() {

  return (
   <ClerkProvider tokenCache={tokenCache}>
    <ClerkLoaded>
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
    <InitialLayout/>
      </SafeAreaView>
    </SafeAreaProvider>
    </ClerkLoaded>
   </ClerkProvider>
      
      
  );
}
