import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function Page() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [trail, setTrail] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [current, setCurrent] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionGranted(false);
        Alert.alert("Permission required", "Please enable location permissions.");
        return;
      }

      setPermissionGranted(true);

      try {
        const last = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const initial = {
          latitude: last.coords.latitude,
          longitude: last.coords.longitude,
        };
        setCurrent(initial);
        setTrail([initial]);

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000,
            distanceInterval: 1,
          },
          (loc) => {
            const point = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setCurrent(point);
            setTrail((t) => [...t, point]);
            mapRef.current?.animateCamera({ center: point, zoom: 16 });
          }
        );
      } catch (e) {
        console.warn(e);
      }
    }

    start();

    return () => {
      sub?.remove();
    };
  }, []);

  if (permissionGranted === false) {
    return (
      <View style={styles.center}>
        <Text>Location permission is required. Enable it in settings.</Text>
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.center}>
        <Text>Obtaining location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: current.latitude,
          longitude: current.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
      >
        {trail.length > 1 && (
          <Polyline
            coordinates={trail}
            strokeWidth={4}
            strokeColor="#007AFF"
          />
        )}
        <Marker coordinate={current} title="You" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});