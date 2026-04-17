import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    bg: string;
    card: string;
    text: string;
    subtitle: string;
    primary: string;
    border: string;
    placeholder: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
  bg: "#f5f5f5",
  card: "#ffffff",
  text: "#000000",
  subtitle: "#666666",
  primary: "#007AFF",
  border: "#cccccc",
  placeholder: "#aaaaaa",
};

const darkColors = {
  bg: "#1a1a1a",
  card: "#2a2a2a",
  text: "#ffffff",
  subtitle: "#aaaaaa",
  primary: "#0A84FF",
  border: "#444444",
  placeholder: "#666666",
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>((colorScheme as Theme) || "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
