import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const CHECKPOINTS_STORAGE_KEY = 'audivia-checkpoints-storage';
const NOTIFICATION_DISTANCE_THRESHOLD = 10;
const CHECKPOINT_NOTIFICATION_CATEGORY_ID = 'checkpoint-arrival';
export const STOP_TOUR_ACTION_ID = 'stop-tour-action';

// This function needs to be called once when the app initializes.
export const setupNotificationActions = () => {
  // Create a custom notification channel for Android with vibration
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('checkpoint-alerts', {
      name: 'Checkpoint Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 1000, 500, 1000, 500, 1000, 500, 1000],
      sound: 'default',
    });
  }

  Notifications.setNotificationCategoryAsync(CHECKPOINT_NOTIFICATION_CATEGORY_ID, [
    {
      identifier: STOP_TOUR_ACTION_ID,
      buttonTitle: 'Dừng Tour',
      options: {
        isDestructive: true,
        opensAppToForeground: false,
      },
    },
  ]);
};

// Configure notification handler for when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    try {
      const { locations } = data as { locations: Location.LocationObject[] };
      const currentLocation = locations[0];

      // --- Location Validation ---
      const locationAge = Date.now() - currentLocation.timestamp;
      if (locationAge > 10000) { // 10 seconds tolerance for staleness
        console.log(`Ignoring stale location update (age: ${Math.round(locationAge / 1000)}s)`);
        return;
      }
      if (currentLocation.coords.accuracy == null || currentLocation.coords.accuracy > 50) {
        console.log(`Ignoring inaccurate location update (accuracy: ${currentLocation.coords.accuracy?.toFixed(1) ?? 'unknown'}m)`);
        return;
      }
      // --- End Validation ---

      const storedData = await AsyncStorage.getItem(CHECKPOINTS_STORAGE_KEY);
      if (!storedData) {
        return; // No data to process
      }

      const { checkpoints, tourId } = JSON.parse(storedData);
      if (!currentLocation || !checkpoints || checkpoints.length === 0 || !tourId) return;

      const remainingCheckpoints = [];
      let checkpointsUpdated = false;

      for (const checkpoint of checkpoints) {
        const distance = getDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          { latitude: checkpoint.latitude, longitude: checkpoint.longitude }
        );

        if (distance <= NOTIFICATION_DISTANCE_THRESHOLD) {
          console.log(`User is within radius for "${checkpoint.title}". Notifying and removing from list.`);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Tới điểm đến!",
              body: `Bạn đang rất gần ${checkpoint.title}. Mở ứng dụng để nghe audio cùng Audi nhé.`,
              sound: Platform.OS === 'ios' ? 'notification_sound.wav' : undefined, // Custom sound for iOS
              data: { tourId: tourId, checkpointId: checkpoint.id },
              categoryIdentifier: CHECKPOINT_NOTIFICATION_CATEGORY_ID,
              vibrate: Platform.OS === 'android' ? [0, 1000, 500, 1000, 500, 1000, 500, 1000] : undefined,
            },
            trigger: Platform.OS === 'android' ? {
              channelId: 'checkpoint-alerts',
            } : null,
          });

          checkpointsUpdated = true; // Mark that we need to update storage
        } else {
          remainingCheckpoints.push(checkpoint); // Keep checkpoint for next time
        }
      }

      if (checkpointsUpdated) {
        // If all checkpoints have been notified, stop tracking
        if (remainingCheckpoints.length === 0) {
          console.log("All checkpoints have been notified. Stopping location tracking.");
          await stopLocationTracking();
        } else {
          // Otherwise, update the list of checkpoints in storage
          const dataToStore = { checkpoints: remainingCheckpoints, tourId: tourId };
          await AsyncStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(dataToStore));
          console.log("Updated remaining checkpoints in storage.");
        }
      }

    } catch (taskError) {
      console.error('Error inside background task:', taskError);
    }
  }
});

export const startLocationTracking = async (tripCheckpoints: any[], tourId: string) => {
  const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTracking) {
    console.log("A previous location tracking task was running. Stopping it before starting a new one.");
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  console.log("Requesting permissions...");
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    alert('Foreground location permission is required.');
    return;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    alert('Background location permission must be set to "Allow all the time" for checkpoint alerts.');
    return;
  }

  const dataToStore = {
    checkpoints: tripCheckpoints,
    tourId: tourId,
  };
  await AsyncStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(dataToStore));

  console.log("Starting background location updates with high-frequency settings...");
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    // Highest possible accuracy for GPS. This is battery-intensive.
    accuracy: Location.Accuracy.BestForNavigation,

    // Request updates every 1 second. This is the key for real-time feel.
    timeInterval: 1000,

    // Notify for any movement, relying on timeInterval for frequency.
    distanceInterval: 0,

    // --- Enhancements for Real-Time Tracking ---
    activityType: Location.ActivityType.Fitness, // Helps iOS prioritize updates for walking.
    pausesUpdatesAutomatically: false, // Prevents iOS from pausing updates to save power.
    // -----------------------------------------

    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Audivia đang dẫn tour!",
      notificationBody: "Theo dõi vị trí của bạn để thông báo khi tới các điểm dừng. Audivia sẽ tự động ngưng theo dõi vị trí khi bạn chọn Kết thúc Tour",
    }
  });
  console.log('High-accuracy location tracking started.');
};

export const stopLocationTracking = async () => {
  const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTracking) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("Stopped location updates.");
  }
  await AsyncStorage.removeItem(CHECKPOINTS_STORAGE_KEY);
  console.log('Location tracking stopped and checkpoints cleared.');
};