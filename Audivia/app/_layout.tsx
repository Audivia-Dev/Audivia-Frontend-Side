import '../global.css';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutContent from '@/contexts/LayoutContext';
import { useEffect } from 'react';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationSignalRService } from '@/services/notificationSignalR';
import { AppState } from 'react-native';
import { chatSignalRService } from '@/services/chat_signalR';
import { customFonts } from '@/utils/font';
import { useFonts } from 'expo-font';

import "@/services/locationNotification";

import * as Notifications from 'expo-notifications';
import { checkUserPurchasedTour } from '@/services/historyTransaction';
import { getTourProgress } from '@/services/progress';
import { setupNotificationActions, STOP_TOUR_ACTION_ID, stopLocationTracking } from '@/services/locationNotification';

export default function RootLayout() {
  const { user } = useUser();
  const [fontsLoaded] = useFonts(customFonts);
  const router = useRouter();

  useEffect(() => {
    console.log("App mounted. Stopping any orphaned location tracking tasks has been disabled from root.");
    // stopLocationTracking(); 

    setupNotificationActions();
  }, []);

  useEffect(() => {
    // Lắng nghe sự kiện khi người dùng nhấn vào thông báo
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(async (response) => {
      // Handle the custom "Stop Tour" action
      if (response.actionIdentifier === STOP_TOUR_ACTION_ID) {
        console.log('User pressed the "Stop Tour" button in the notification.');
        await stopLocationTracking();
        return; // Action handled, no need to navigate.
      }

      const { tourId, checkpointId } = response.notification.request.content.data;
      console.log('Notification tapped. Data:', { tourId, checkpointId });

      if (tourId && checkpointId && user?.id) {
        try {
          console.log(`Fetching tour-specific data for user ${user.id} and tour ${tourId}`);

          // Lấy characterId người dùng đã chọn cho tour này
          const purchaseInfo = await checkUserPurchasedTour(user.id, tourId as string);
          const characterIdForTour = purchaseInfo?.audioCharacterId;
          console.log('Retrieved characterId for this tour:', characterIdForTour);

          // Lấy tiến trình hiện tại của tour
          const progressData = await getTourProgress(user.id, tourId as string);
          const tourProgressId = progressData?.response?.id;
          console.log('Retrieved tourProgressId:', tourProgressId);

          if (characterIdForTour && tourProgressId) {
            // Điều hướng đến màn hình phát audio với đầy đủ thông tin
            const path = `/audio_player?checkpointId=${checkpointId}&characterId=${characterIdForTour}&tourProgressId=${tourProgressId}`;
            console.log('Navigating to:', path);
            router.push(path as any);
          } else {
            console.warn('Could not retrieve character or progress. Navigating to tour audio screen as a fallback.');
            router.push(`/(screens)/tour_audio?tourId=${tourId}` as any);
          }
        } catch (error) {
          console.error('Error handling notification tap:', error);
          // Điều hướng dự phòng nếu có lỗi
          router.push(`/(screens)/tour_audio?tourId=${tourId}` as any);
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationResponseListener);
    };
  }, [user?.id, router]);

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

        console.log('Initializing notification SignalR...');
        await notificationSignalRService.start(token);
        console.log('Notification SignalR initialized successfully');

        console.log('Initializing chat SignalR...');
        await chatSignalRService.startConnection(token);
        console.log('Chat SignalR initialized successfully');

        console.log('All SignalR services initialized successfully');
      } catch (error) {
        console.error('Error initializing SignalR in root layout:', error);
        // Thử kết nối lại sau 2 giây nếu thất bại
        setTimeout(() => {
          if (user?.id) {
            initializeSignalR();
          }
        }, 2000);
      }
    };

    if (user?.id) {
      console.log('User ID exists, initializing SignalR...');
      initializeSignalR();
    } else {
      console.log('No user ID found, skipping SignalR initialization');
    }

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
            if (!chatSignalRService.isConnected()) {
              console.log('Reconnecting chat SignalR...');
              await chatSignalRService.startConnection(token);
              console.log('Chat SignalR reconnected successfully');
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <LayoutContent />
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
