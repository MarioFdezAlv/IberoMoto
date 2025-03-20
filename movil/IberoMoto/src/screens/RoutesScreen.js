import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const RoutesScreen = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null); // Ruta seleccionada

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://172.20.10.6:8000/api/routes/");
        const data = await response.json();
        setRoutes(data.features || data);
      } catch (error) {
        console.error("Error al obtener rutas:", error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={styles.initialRegion}>
        {/* Renderizar solo los puntos de inicio de las rutas */}
        {routes.map((route, index) => {
          if (!route.geometry || !route.geometry.coordinates) return null;

          const positions = route.geometry.coordinates.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));

          return (
            <Marker
              key={`marker-${index}`}
              coordinate={positions[0]} // Solo el primer punto de la ruta
              title={route.properties?.name || "Ruta"}
              onPress={() => setSelectedRoute(positions)} // Mostrar ruta al hacer clic
            />
          );
        })}

        {/* Renderizar la ruta seleccionada */}
        {selectedRoute && (
          <Polyline
            coordinates={selectedRoute}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Fondo oscuro para mejor contraste
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  initialRegion: {
    latitude: 40.0,
    longitude: -4.0,
    latitudeDelta: 10,
    longitudeDelta: 10,
  },
});

export default RoutesScreen;
