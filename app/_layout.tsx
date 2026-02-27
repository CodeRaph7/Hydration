import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { createContext, useContext, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { darkTheme, lightTheme } from "./utils";


type ThemeContextType = {
  isDark: boolean;
  theme: typeof lightTheme;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: lightTheme,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}


function CustomDrawer(props: any) {
  const { isDark, theme, toggle } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.bg }}
    >
      <View style={styles.drawerHeader}>
        <Text style={[styles.drawerTitle, { color: theme.text }]}>
          ⚙️ Settings
        </Text>
      </View>

      <View style={[styles.row, { borderColor: theme.border }]}>
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={22}
          color={theme.accent}
        />
        <Text style={[styles.label, { color: theme.text }]}>
          {isDark ? "Dark Mode" : "Light Mode"}
        </Text>
        <Switch value={isDark} onValueChange={toggle} />
      </View>
    </DrawerContentScrollView>
  );
}


export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ isDark, theme, toggle: () => setIsDark((v) => !v) }}
    >
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
          drawerStyle: { backgroundColor: theme.bg },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ title: "Map & Weather" }}
        />
      </Drawer>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
});