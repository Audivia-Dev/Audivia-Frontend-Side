import '../global.css';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutContent from '@/contexts/LayoutContext';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationSignalRService } from '@/services/notificationSignalR';
import { AppState } from 'react-native';

export default function RootLayout() {
  const { user } = useUser();

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        await notificationSignalRService.start(token);
        console.log('SignalR initialized in root layout');
      } catch (error) {
        console.error('Error initializing SignalR in root layout:', error);
      }
    };

    if (user?.id) {
      initializeSignalR();
    }

    // Lắng nghe trạng thái app để xử lý khi app chuyển background/foreground
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
   //   if (nextAppState === 'active') {
        // Khi app chuyển sang foreground, kiểm tra và reconnect nếu cần
        try {
          const token = await AsyncStorage.getItem('accessToken');
          console.log("token", token);
          if (token) {
            
            var rs = await notificationSignalRService.start(token);
            console.log("ket qua: ", rs);
            
          }
        } catch (error) {
          console.error('Error checking SignalR connection:', error);
        }
      }
   // }
  );

    return () => {
      subscription.remove();
    };
  }, [user?.id]);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <LayoutContent/>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
