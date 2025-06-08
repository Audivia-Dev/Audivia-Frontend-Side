import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';

const LOCATION_TASK_NAME = 'background-location-task';
const CHECKPOINTS_STORAGE_KEY = 'audivia-checkpoints-storage';
const NOTIFICATION_TIMESTAMPS_KEY = 'audivia-notification-timestamps-storage';
const NOTIFICATION_DISTANCE_THRESHOLD = 5; // 5 meters for better testing
const NOTIFICATION_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
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

      // --- Location Validation ---
      // 1. Ignore stale location updates (older than 5 seconds)
      const locationAge = Date.now() - currentLocation.timestamp;
      if (locationAge > 5000) {
        console.log(`Ignoring stale location update (age: ${Math.round(locationAge / 1000)}s)`);
        return;
      }
      // 2. Ignore inaccurate location updates (accuracy > 25 meters)
      if (currentLocation.coords.accuracy == null || currentLocation.coords.accuracy > 25) {
        console.log(`Ignoring inaccurate location update (accuracy: ${currentLocation.coords.accuracy?.toFixed(1) ?? 'unknown'}m)`);
        return;
      }
      // --- End Validation ---

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
              body: `Bạn đang rất gần ${checkpoint.title}. Mở ứng dụng để nghe audio cùng Audi nhé.`,
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
      notificationBody: "Theo dõi vị trí của bạn để thông báo khi tới các điểm dừng.",
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
  await AsyncStorage.removeItem(NOTIFICATION_TIMESTAMPS_KEY); // Also clear timestamps on stop
  console.log('Location tracking stopped and checkpoints cleared.');
};