import '../global.css';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutContent from '@/contexts/LayoutContext';
import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationSignalRService } from '@/services/notificationSignalR';
import { AppState } from 'react-native';
import { chatSignalRService } from '@/services/chat_signalR';
import { customFonts } from '@/utils/font';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const { user } = useUser();
  const [fontsLoaded] = useFonts(customFonts);
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    } else {
      SplashScreen.preventAutoHideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        console.log('Starting SignalR initialization...');
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Token exists:', !!token);
        if (!token) return;

        // Khởi tạo tuần tự để đảm bảo kết nối thành công
        console.log('Initializing notification SignalR...');
        await notificationSignalRService.start(token);
        console.log('Notification SignalR initialized successfully');

        console.log('Initializing chat SignalR...');
        await chatSignalRService.startConnection(token);
        console.log('Chat SignalR initialized successfully');

        console.log('All SignalR services initialized successfully');
      } catch (error) {
        console.error('Error initializing SignalR in root layout:', error);
        // Thử kết nối lại sau 5 giây nếu thất bại
        setTimeout(() => {
          if (user?.id) {
            initializeSignalR();
          }
        }, 3000);
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
        try {
          const token = await AsyncStorage.getItem('accessToken');
          if (token) {
            // Kiểm tra trạng thái kết nối trước khi thử kết nối lại
            if (!notificationSignalRService.isConnected()) {
              console.log('Reconnecting notification SignalR...');
              await notificationSignalRService.start(token);
              console.log('Notification SignalR reconnected successfully');
            }
          }
        } catch (error) {
          console.error('Error reconnecting SignalR:', error);
        }
      }
    });

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
