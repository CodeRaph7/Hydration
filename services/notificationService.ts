import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { getWorkingHours, isWithinWorkingHours } from "./storageService";

const HYDRATION_TASK_NAME = "hydration-reminder-task";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  } as any ),
});

TaskManager.defineTask(HYDRATION_TASK_NAME, async () => {
  try {
    const hours = await getWorkingHours();

    if (isWithinWorkingHours(hours)) {
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: " Hydration Reminder",
          body: "Time to drink ",
          sound: true,
        },
        trigger: null, 
      });

      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const registerBackgroundTask = async (): Promise<boolean> => {
  try {
    
    const notifPermission = await requestNotificationPermission();

    if (!notifPermission) {
      console.warn("Notification permission not granted");
      return false;
    }

  
    await BackgroundFetch.registerTaskAsync(HYDRATION_TASK_NAME, {
      minimumInterval: 3 * 60, 
      stopOnTerminate: false,
      startOnBoot: true,
    });

    return true;
  } catch (error) {
    console.error("Error registering background task:", error);
    return false;
  }
};

export const unregisterBackgroundTask = async (): Promise<void> => {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(HYDRATION_TASK_NAME);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(HYDRATION_TASK_NAME);
    }
  } catch (error) {
    console.error("Error unregistering background task:", error);
  }
};

export { HYDRATION_TASK_NAME };
