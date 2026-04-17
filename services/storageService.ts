import AsyncStorage from "@react-native-async-storage/async-storage";

const WORKING_HOURS_KEY = "working_hours";
const TASK_ENABLED_KEY = "task_enabled";

export interface WorkingHours {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

const DEFAULT_WORKING_HOURS: WorkingHours = {
  startHour: 9,
  startMinute: 0,
  endHour: 17,
  endMinute: 0,
};

export const saveWorkingHours = async (hours: WorkingHours): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(hours));
  } catch (error) {
    console.error("Error saving working hours:", error);
  }
};

export const getWorkingHours = async (): Promise<WorkingHours> => {
  try {
    const data = await AsyncStorage.getItem(WORKING_HOURS_KEY);
    return data ? JSON.parse(data) : DEFAULT_WORKING_HOURS;
  } catch (error) {
    console.error("Error reading working hours:", error);
    return DEFAULT_WORKING_HOURS;
  }
};

export const saveTaskEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASK_ENABLED_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error("Error saving task enabled state:", error);
  }
};

export const getTaskEnabled = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(TASK_ENABLED_KEY);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error("Error reading task enabled state:", error);
    return false;
  }
};

export const isWithinWorkingHours = (hours: WorkingHours): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const startTotalMinutes = hours.startHour * 60 + hours.startMinute;
  const endTotalMinutes = hours.endHour * 60 + hours.endMinute;
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  return (
    currentTotalMinutes >= startTotalMinutes &&
    currentTotalMinutes < endTotalMinutes
  );
};
