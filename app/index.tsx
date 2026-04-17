import { MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { WorkingHoursPicker } from "../components/WorkingHoursPicker";
import { useTheme } from "../context/ThemeContext";
import {
  registerBackgroundTask,
  unregisterBackgroundTask,
} from "../services/notificationService";
import {
  WorkingHours,
  getTaskEnabled,
  getWorkingHours,
  saveTaskEnabled,
  saveWorkingHours,
} from "../services/storageService";

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [taskEnabled, setTaskEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [hours, enabled] = await Promise.all([
        getWorkingHours(),
        getTaskEnabled(),
      ]);
      setWorkingHours(hours);
      setTaskEnabled(enabled);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingHoursSave = async (hours: WorkingHours) => {
    try {
      await saveWorkingHours(hours);
      setWorkingHours(hours);
    } catch (error) {
      console.error("Error saving working hours:", error);
      Alert.alert("Error", "Failed to save working hours");
    }
  };

  const handleTaskToggle = async (enabled: boolean) => {
    setRegistering(true);
    try {
      if (enabled) {
        const registered = await registerBackgroundTask();
        if (registered) {
          setTaskEnabled(true);
          await saveTaskEnabled(true);
          Alert.alert("Success", "Hydration reminder activated!");
        } else {
          Alert.alert(
            "Permission Required",
            "Please enable notification permissions",
          );
        }
      } else {
        await unregisterBackgroundTask();
        setTaskEnabled(false);
        await saveTaskEnabled(false);
        Alert.alert("Success", "Hydration reminder deactivated");
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      Alert.alert("Error", "Failed to update reminder status");
      setTaskEnabled(!enabled);
    } finally {
      setRegistering(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Hydration Reminder",
          body: "Time to drink water! (Test)",
          sound: true,
        },
        trigger: null,
      });
      Alert.alert("Test", "Notification sent!");
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  };

  if (loading || !workingHours) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.bg },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const startTime = `${String(workingHours.startHour).padStart(2, "0")}:${String(
    workingHours.startMinute,
  ).padStart(2, "0")}`;
  const endTime = `${String(workingHours.endHour).padStart(2, "0")}:${String(
    workingHours.endMinute,
  ).padStart(2, "0")}`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <MaterialIcons name="local-drink" size={32} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Hydration Reminder
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
              Stay hydrated during work hours
            </Text>
          </View>
        </View>

        {/* Theme Toggle */}
        <View style={[styles.row, { marginTop: 12 }]}>
          <MaterialIcons
            name={theme === "dark" ? "dark-mode" : "light-mode"}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            {theme === "dark" ? "Dark" : "Light"} Mode
          </Text>
          <Switch value={theme === "dark"} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Task Status */}
      <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: taskEnabled ? "#4caf50" : "#f44336" },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: colors.text }]}>
              Reminder Status
            </Text>
            <Text style={[styles.statusSubtitle, { color: colors.subtitle }]}>
              {taskEnabled ? "Active" : "Inactive"}
            </Text>
          </View>
          <Switch
            value={taskEnabled}
            onValueChange={handleTaskToggle}
            disabled={registering}
          />
        </View>
        {registering && (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
        )}
      </View>

      {/* Current Settings */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          Current Working Hours
        </Text>
        <View style={[styles.timeRow, { borderColor: colors.border }]}>
          <View style={styles.timeDisplay}>
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.text }]}>
              {startTime} - {endTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Working Hours Picker */}
      <WorkingHoursPicker
        onSave={handleWorkingHoursSave}
        initialHours={workingHours}
      />

      {/* Test Button */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>
          Test Notification
        </Text>
        <Text style={[styles.cardDescription, { color: colors.subtitle }]}>
          Send yourself a hydration reminder notification
        </Text>
      </View>

      {/* Info Section */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoHeading, { color: colors.text }]}>
          How it works
        </Text>
        <Text style={[styles.infoText, { color: colors.subtitle }]}>
          • Reminders run every 3 minutes in the background
        </Text>
        <Text style={[styles.infoText, { color: colors.subtitle }]}>
          • Only active during your working hours
        </Text>
        <Text style={[styles.infoText, { color: colors.subtitle }]}>
          • Works even when the app is closed
        </Text>
        <Text style={[styles.infoText, { color: colors.subtitle }]}>
          • Requires notification permissions
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 12,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
});
