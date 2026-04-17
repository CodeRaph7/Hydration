import React, { useState, createContext, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';

// ============================================
// THEME SYSTEM (Exercise 3)
// ============================================

const themes = {
  light: {
    backgroundColor: '#FFFFFF',
    cardBackground: '#F5F5F5',
    textColor: '#000000',
    secondaryText: '#666666',
    primaryColor: '#4A90E2',
    borderColor: '#E0E0E0',
    buttonBackground: '#4A90E2',
    buttonText: '#FFFFFF',
    weatherCardBg: '#4A90E2',
    weatherText: '#FFFFFF',
    galleryItemBg: '#E0E0E0',
  },
  dark: {
    backgroundColor: '#1A1A1A',
    cardBackground: '#2D2D2D',
    textColor: '#FFFFFF',
    secondaryText: '#AAAAAA',
    primaryColor: '#5AA5F5',
    borderColor: '#404040',
    buttonBackground: '#5AA5F5',
    buttonText: '#000000',
    weatherCardBg: '#2D5F8D',
    weatherText: '#FFFFFF',
    galleryItemBg: '#404040',
  },
};

const ThemeContext = createContext({
  theme: themes.light,
  isDarkMode: false,
  toggleTheme: () => {},
});

function ThemeProvider({ children }:any) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const theme = isDarkMode ? themes.dark : themes.light;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ============================================
// WEATHER CARD COMPONENT (Exercise 1)
// ============================================

function WeatherCard() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.weatherCard, { backgroundColor: theme.weatherCardBg }]}>
      <Text style={[styles.city, { color: theme.weatherText }]}>
        San Francisco
      </Text>
      <Text style={[styles.temp, { color: theme.weatherText }]}>
        72°
      </Text>
      <View style={styles.conditionRow}>
        <Text style={styles.weatherIcon}>☀️</Text>
        <Text style={[styles.description, { color: theme.weatherText }]}>
          Sunny
        </Text>
      </View>
      <View style={styles.highLowRow}>
        <Text style={[styles.high, { color: theme.weatherText }]}>
          H: 78°
        </Text>
        <Text style={[styles.low, { color: theme.weatherText }]}>
          L: 65°
        </Text>
      </View>
    </View>
  );
}

// ============================================
// RESPONSIVE GALLERY COMPONENT (Exercise 2)
// ============================================

function ResponsiveGallery() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  
  // Determine number of columns based on screen width
  const getColumns = () => {
    if (width < 375) return 2;
    if (width <= 768) return 3;
    return 4;
  };

  const columns = getColumns();
  const spacing = 8;
  const itemWidth = (width - (spacing * (columns + 1))) / columns;

  // Sample data
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i.toString(),
    uri: `https://picsum.photos/seed/${i}/400/400`,
  }));

  const renderItem = ({ item }:any) => (
    <View style={[
      styles.galleryItem, 
      { 
        width: itemWidth, 
        height: itemWidth,
        backgroundColor: theme.galleryItemBg,
      }
    ]}>
      <Image 
        source={{ uri: item.uri }} 
        style={styles.galleryImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.galleryContainer}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        key={columns}
        contentContainerStyle={styles.galleryList}
        columnWrapperStyle={styles.galleryRow}
        scrollEnabled={false}
      />
    </View>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function AppContent() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Theme Toggle */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textColor }]}>
            React Native Exercises
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            All Three Exercises Combined
          </Text>
        </View>

        {/* Theme Toggle Button */}
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: theme.buttonBackground }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.toggleButtonText, { color: theme.buttonText }]}>
            {isDarkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </Text>
        </TouchableOpacity>

        {/* Exercise 1: Weather Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Exercise 1: Weather Card
          </Text>
          <WeatherCard />
        </View>

        {/* Exercise 2: Responsive Gallery */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Exercise 2: Responsive Gallery
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.secondaryText }]}>
            Adapts to screen size: 2-4 columns
          </Text>
          <ResponsiveGallery />
        </View>

        {/* Exercise 3: Theme Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Exercise 3: Theme Switcher
          </Text>
          <View style={[
            styles.infoCard, 
            { 
              backgroundColor: theme.cardBackground,
              borderColor: theme.borderColor,
            }
          ]}>
            <Text style={[styles.infoTitle, { color: theme.textColor }]}>
              Current Theme: {isDarkMode ? 'Dark' : 'Light'}
            </Text>
            <Text style={[styles.infoText, { color: theme.secondaryText }]}>
              All components above are using the centralized theme system. 
              Toggle the theme button to see everything update dynamically!
            </Text>
            <Text style={[styles.infoText, { color: theme.secondaryText, marginTop: 12 }]}>
              Features:{'\n'}
              • Context API for state management{'\n'}
              • Dynamic color updates{'\n'}
              • Proper contrast ratios{'\n'}
              • Smooth transitions
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Main export wrapped with ThemeProvider
export default function CombinedApp() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  toggleButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  
  // Weather Card Styles (Exercise 1)
  weatherCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  city: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  temp: {
    fontSize: 72,
    fontWeight: '300',
    marginBottom: 8,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  description: {
    fontSize: 20,
  },
  highLowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  high: {
    fontSize: 18,
    fontWeight: '600',
  },
  low: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Gallery Styles (Exercise 2)
  galleryContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryList: {
    padding: 8,
  },
  galleryRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  galleryItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  
  // Info Card Styles (Exercise 3)
  infoCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});