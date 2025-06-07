import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';

const LOCATION_TASK_NAME = 'background-location-task';
const CHECKPOINTS_STORAGE_KEY = 'audivia-checkpoints-storage';
const NOTIFICATION_DISTANCE_THRESHOLD = 5; // 5 meters for better testing

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

      const storedCheckpoints = await AsyncStorage.getItem(CHECKPOINTS_STORAGE_KEY);
      if (!storedCheckpoints) {
        return; // No checkpoints to process
      }

      let checkpoints: any[] = JSON.parse(storedCheckpoints);
      if (!currentLocation || checkpoints.length === 0) return;

      let hasMadeChanges = false;
      for (const checkpoint of checkpoints) {
        if (checkpoint.notified) continue; // Skip if already notified

        const distance = getDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          { latitude: checkpoint.latitude, longitude: checkpoint.longitude }
        );

        console.log(`Distance to "${checkpoint.title}": ${distance.toFixed(1)}m`);

        if (distance <= NOTIFICATION_DISTANCE_THRESHOLD) {
          console.log(`Sending notification for "${checkpoint.title}"`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Checkpoint Reached!",
              body: `You are near ${checkpoint.title}. Open the app to learn more.`,
              sound: 'default',
            },
            trigger: null,
          });

          checkpoint.notified = true; // Mark as notified to prevent spam
          hasMadeChanges = true;
        }
      }

      if (hasMadeChanges) {
        await AsyncStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(checkpoints));
      }

    } catch (taskError) {
      console.error('Error inside background task:', taskError);
    }
  }
});

export const startLocationTracking = async (tripCheckpoints: any[]) => {
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
  const initialCheckpoints = tripCheckpoints.map(cp => ({ ...cp, notified: false }));
  await AsyncStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(initialCheckpoints));

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
  console.log('Location tracking stopped and checkpoints cleared.');
};