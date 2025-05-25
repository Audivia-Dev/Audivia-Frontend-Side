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
import { chatSignalRService } from '@/services/chat_signalR';

export default function RootLayout() {
  const { user } = useUser();

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        console.log('Starting SignalR initialization...');
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Token exists:', !!token);
        if (!token) return;

        //khởi tạo song song 2 signal r
        console.log('Initializing both SignalR services...');
        await Promise.all([
          notificationSignalRService.start(token),
          chatSignalRService.startConnection(),
        ])
       
        console.log('SignalR chat and notification initialized in root layout');
      } catch (error) {
        console.error('Error initializing SignalR in root layout:', error);
      }
    };

    if (user?.id) {
      console.log('User ID exists, initializing SignalR...');
      initializeSignalR();
    } else {
      console.log('No user ID found, skipping SignalR initialization');
    }

    // Lắng nghe trạng thái app để xử lý khi app chuyển background/foreground
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
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
    }
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
