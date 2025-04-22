import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useAuth } from './AuthContext';
import FloatingButton from '../components/FloatingButton';
import { COLORS } from '@/constants/theme';

export default function LayoutContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Stack screenOptions={{headerShown: false}}/>
      {isAuthenticated && <FloatingButton onPress={() => console.log("Pressed")}/>}
    </SafeAreaView>
  );
}