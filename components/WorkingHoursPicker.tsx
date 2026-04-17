import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import {
    WorkingHours
} from "../services/storageService";

interface TimePickerProps {
  label: string;
  hour: number;
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  colors: any;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  colors,
}) => {
  return (
    <View style={styles.timePickerContainer}>
      <Text style={[styles.timeLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.timeInputRow}>
        <View style={styles.timeInputGroup}>
          <Text style={[styles.timeInputLabel, { color: colors.subtitle }]}>
            Hour
          </Text>
          <TextInput
            style={[
              styles.timeInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={String(hour).padStart(2, "0")}
            onChangeText={(value) => {
              const num = parseInt(value) || 0;
              if (num >= 0 && num <= 23) {
                onHourChange(num);
              }
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <Text style={[styles.separator, { color: colors.text }]}>:</Text>
        <View style={styles.timeInputGroup}>
          <Text style={[styles.timeInputLabel, { color: colors.subtitle }]}>
            Minute
          </Text>
          <TextInput
            style={[
              styles.timeInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={String(minute).padStart(2, "0")}
            onChangeText={(value) => {
              const num = parseInt(value) || 0;
              if (num >= 0 && num <= 59) {
                onMinuteChange(num);
              }
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>
    </View>
  );
};

interface WorkingHoursPickerProps {
  onSave: (hours: WorkingHours) => void;
  initialHours: WorkingHours;
}

export const WorkingHoursPicker: React.FC<WorkingHoursPickerProps> = ({
  onSave,
  initialHours,
}) => {
  const { colors } = useTheme();
  const [startHour, setStartHour] = useState(initialHours.startHour);
  const [startMinute, setStartMinute] = useState(initialHours.startMinute);
  const [endHour, setEndHour] = useState(initialHours.endHour);
  const [endMinute, setEndMinute] = useState(initialHours.endMinute);

  const handleSave = () => {
    if (startHour * 60 + startMinute >= endHour * 60 + endMinute) {
      Alert.alert("Invalid Hours", "Start time must be before end time");
      return;
    }

    onSave({
      startHour,
      startMinute,
      endHour,
      endMinute,
    });

    Alert.alert("Success", "Working hours saved!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Set Working Hours
      </Text>

      <TimePicker
        label="Start Time"
        hour={startHour}
        minute={startMinute}
        onHourChange={setStartHour}
        onMinuteChange={setStartMinute}
        colors={colors}
      />

      <TimePicker
        label="End Time"
        hour={endHour}
        minute={endMinute}
        onHourChange={setEndHour}
        onMinuteChange={setEndMinute}
        colors={colors}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <MaterialIcons name="save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Hours</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timePickerContainer: {
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeInputGroup: {
    alignItems: "center",
  },
  timeInputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  timeInput: {
    width: 50,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
