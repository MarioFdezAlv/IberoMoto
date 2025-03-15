import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const RoutesScreen = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://192.168.1.169:8000/api/routes/");
        const data = await response.json();
        console.log("Datos recibidos:", data); // 🔍 Verificar estructura de datos

        // Asegurar que se extraigan las rutas correctamente
        const extractedRoutes = data.features ? data.features : data;
        setRoutes(extractedRoutes);
      } catch (error) {
        console.error("Error al obtener rutas:", error);
      }
    };

    fetchRoutes();
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
        {routes.length > 0 ? (
          routes.map((route, index) => {
            if (!route.geometry || !route.geometry.coordinates) return null;

            const positions = route.geometry.coordinates.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            }));

            if (positions.length === 0) return null;

            return (
              <React.Fragment key={index}>
                <Polyline
                  coordinates={positions}
                  strokeColor="blue"
                  strokeWidth={3}
                />
                <Marker
                  coordinate={positions[0]}
                  title={route.properties?.name}
                />
              </React.Fragment>
            );
          })
        ) : (
          <Text style={styles.noRoutesText}>No hay rutas disponibles</Text>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  noRoutesText: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    fontSize: 16,
    color: "red",
  },
});

export default RoutesScreen;
