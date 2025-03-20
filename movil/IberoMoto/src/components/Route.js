import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const Route = ({ routeData }) => {
  // Extrae info de routeData.properties
  const name = routeData.properties?.name || "Ruta sin nombre";
  const description = routeData.properties?.description || "Sin descripción";
  const userName = routeData.properties?.user || "Usuario desconocido";

  // Convierte coordenadas [lon, lat] a { latitude, longitude }
  // El campo "coordinates" de routeData.geometry es un array de [lon, lat]
  const coordinates = routeData.geometry?.coordinates || [];
  const polylineCoords = coordinates.map(([lon, lat]) => ({
    latitude: lat,
    longitude: lon,
  }));

  // Calcula un "centro" para el mapa. Tomamos el primer punto o un fallback.
  const initialCoordinate =
    polylineCoords.length > 0
      ? polylineCoords[Math.floor(polylineCoords.length / 2)]
      : { latitude: 0, longitude: 0 };

  return (
    <View style={styles.itemBox}>
      <Text style={styles.routeName}>{name}</Text>
      <Text style={styles.routeUser}>Creado por: {userName}</Text>
      <Text style={styles.routeDescription}>{description}</Text>

      {/* Mapa con la línea de la ruta */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialCoordinate.latitude,
          longitude: initialCoordinate.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {polylineCoords.length > 0 && (
          <>
            {/* Marcador en el primer punto (opcional) */}
            <Marker coordinate={polylineCoords[0]} />
            <Polyline
              coordinates={polylineCoords}
              strokeColor="#E63946"
              strokeWidth={4}
            />
          </>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  routeName: {
    color: "#E63946",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  routeUser: {
    color: "#A8A8A8",
    fontSize: 14,
    marginBottom: 5,
  },
  routeDescription: {
    color: "#A8A8A8",
    fontSize: 14,
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default Route;
