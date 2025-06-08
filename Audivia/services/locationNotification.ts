import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';

const LOCATION_TASK_NAME = 'background-location-task';
const CHECKPOINTS_STORAGE_KEY = 'audivia-checkpoints-storage';
const NOTIFICATION_TIMESTAMPS_KEY = 'audivia-notification-timestamps-storage';
const NOTIFICATION_DISTANCE_THRESHOLD = 10; // 10 meters for better testing
const NOTIFICATION_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const CHECKPOINT_NOTIFICATION_CATEGORY_ID = 'checkpoint-arrival';
export const STOP_TOUR_ACTION_ID = 'stop-tour-action';

// This function needs to be called once when the app initializes.
export const setupNotificationActions = () => {
  Notifications.setNotificationCategoryAsync(CHECKPOINT_NOTIFICATION_CATEGORY_ID, [
    {
      identifier: STOP_TOUR_ACTION_ID,
      buttonTitle: 'Dừng Tour',
      options: {
        isDestructive: true,
        opensAppToForeground: false, // Handle action in the background
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

      const storedData = await AsyncStorage.getItem(CHECKPOINTS_STORAGE_KEY);
      const timestampsData = await AsyncStorage.getItem(NOTIFICATION_TIMESTAMPS_KEY);
      const notificationTimestamps = timestampsData ? JSON.parse(timestampsData) : {};

      if (!storedData) {
        return; // No data to process
      }

      const { checkpoints, tourId } = JSON.parse(storedData)
      if (!currentLocation || !checkpoints || checkpoints.length === 0 || !tourId) return;

      let timestampsNeedUpdate = false;
      for (const checkpoint of checkpoints) {
        const distance = getDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          { latitude: checkpoint.latitude, longitude: checkpoint.longitude }
        );

        const lastNotified = notificationTimestamps[checkpoint.id] || 0;
        const hasCooledDown = Date.now() - lastNotified > NOTIFICATION_COOLDOWN_MS;

        if (distance <= NOTIFICATION_DISTANCE_THRESHOLD && hasCooledDown) {
          console.log(`User is within radius for "${checkpoint.title}" and cooldown has passed. Notifying.`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Tới điểm đến!",
              body: `Bạn đang rất gần ${checkpoint.title}. Mở ứng dụng để nghe audio.`,
              sound: 'default',
              data: {
                tourId: tourId,
                checkpointId: checkpoint.id
              },
              categoryIdentifier: CHECKPOINT_NOTIFICATION_CATEGORY_ID,
            },
            trigger: null,
          });

          // Update the timestamp for this checkpoint
          notificationTimestamps[checkpoint.id] = Date.now();
          timestampsNeedUpdate = true;
        }
      }

      if (timestampsNeedUpdate) {
        await AsyncStorage.setItem(NOTIFICATION_TIMESTAMPS_KEY, JSON.stringify(notificationTimestamps));
      }

    } catch (taskError) {
      console.error('Error inside background task:', taskError);
    }
  }
});

export const startLocationTracking = async (tripCheckpoints: any[], tourId: string) => {
  // First, check if a tracking task is already running.
  // If so, stop it before starting a new one to prevent conflicts.
  const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTracking) {
    console.log("A previous location tracking task was running. Stopping it before starting a new one.");
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  // Clear any previous notification timestamps to ensure a fresh session
  await AsyncStorage.removeItem(NOTIFICATION_TIMESTAMPS_KEY);

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

  // Store non-notified checkpoints for the background task
  const dataToStore = {
    checkpoints: tripCheckpoints, // Store original checkpoints without `notified` flag
    tourId: tourId,
  };
  await AsyncStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(dataToStore));

  console.log("Starting background location updates...");
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 5000, // 5 seconds
    distanceInterval: 2, // 2 meters
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Audivia is guiding your tour",
      notificationBody: "Tracking your location for checkpoint alerts.",
    }
  });
  console.log('Location tracking started.');
};

export const stopLocationTracking = async () => {
  const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTracking) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("Stopped location updates.");
  }
  await AsyncStorage.removeItem(CHECKPOINTS_STORAGE_KEY);
  await AsyncStorage.removeItem(NOTIFICATION_TIMESTAMPS_KEY); // Also clear timestamps on stop
  console.log('Location tracking stopped and checkpoints cleared.');
};