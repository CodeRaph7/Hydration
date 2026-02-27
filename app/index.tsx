import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "./_layout";
import { Coords, DayWeather, fetchWeather, geocode, weatherEmoji } from "./utils";

export default function Page() {
  const { theme } = useTheme();

  const [coords, setCoords] = useState<Coords | null>(null);
  const [weather, setWeather] = useState<DayWeather[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const c: Coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setCoords(c);
      const w = await fetchWeather(c.latitude, c.longitude);
      setWeather(w);
      setLoading(false);
    })();
  }, []);

  
  async function moveTo(c: Coords) {
    setCoords(c);
    mapRef.current?.animateToRegion({
      ...c,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    const w = await fetchWeather(c.latitude, c.longitude);
    setWeather(w);
  }


  async function handleSearch() {
    if (!search.trim()) return;
    const c = await geocode(search.trim());
    if (!c) return alert("Location not found");
    setSearch("");
    await moveTo(c);
  }

 
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={{ color: theme.text, marginTop: 10 }}>
          Getting your location…
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>

      
      <View style={[styles.searchRow, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Search a city…"
          placeholderTextColor={theme.placeholder}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.goBtn, { backgroundColor: theme.accent }]}
          onPress={handleSearch}
        >
          <Text style={styles.goBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {coords ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            ...coords,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
        >
          <Marker coordinate={coords} />
        </MapView>
      ) : (
        <View style={[styles.center, { flex: 1 }]}>
          <Text style={{ color: theme.text }}>Location unavailable</Text>
        </View>
      )}

      {weather.length > 0 && (
        <View style={[styles.weatherCard, { backgroundColor: theme.card }]}>
          
          <Text style={[styles.todayText, { color: theme.text }]}>
            {weatherEmoji(weather[0].code)}  Today:{" "}
            {weather[0].max}° / {weather[0].min}°
          </Text>

          <FlatList
            horizontal
            data={weather.slice(1)}
            keyExtractor={(item) => item.date}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.dayCard, { backgroundColor: theme.dayCard }]}>
                <Text style={[styles.dayDate, { color: theme.subText }]}>
                  {item.date.slice(5)}
                </Text>
                <Text style={styles.dayEmoji}>{weatherEmoji(item.code)}</Text>
                <Text style={[styles.dayTemp, { color: theme.text }]}>
                  {item.max}°/{item.min}°
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  goBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  goBtnText: { color: "#fff", fontWeight: "bold" },
  map: { flex: 1 },
  weatherCard: {
    padding: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  todayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dayCard: {
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 70,
  },
  dayDate: { fontSize: 12, marginBottom: 4 },
  dayEmoji: { fontSize: 22 },
  dayTemp: { fontSize: 13, fontWeight: "600", marginTop: 4 },
});