import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const RoutesScreen = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.169:8000/api/routes/")
      .then((res) => res.json())
      .then((data) => setRoutes(data.features || data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.0,
          longitude: -4.0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {routes.map((route, index) => {
          if (!route.geometry || !route.geometry.coordinates) return null;

          const positions = route.geometry.coordinates.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));

          return (
            <React.Fragment key={index}>
              <Polyline coordinates={positions} strokeColor="blue" strokeWidth={3} />
              <Marker coordinate={positions[0]} title={route.properties?.name} />
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default RoutesScreen;
