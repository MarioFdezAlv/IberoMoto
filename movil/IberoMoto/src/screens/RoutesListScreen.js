// src/screens/RoutesListScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
// Para obtener la ubicación
import * as Location from "expo-location";
import { getDistance } from "geolib";

// Este es el componente que creaste antes que muestra cada ruta en un card con MapView
import Route from "../components/Route";

export default function RoutesListScreen() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      // 1) Obtener ubicación del usuario (si lo deseas para ordenar por cercanía)
      let { status } = await Location.requestForegroundPermissionsAsync();
      let userCoords = null;
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        userCoords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      }

      // 2) Obtener las rutas
      const response = await fetch("http://172.20.10.6:8000/api/routes/");
      const data = await response.json();
      let fetchedRoutes = data.features || data;

      // 3) Calcular la distancia al usuario (si userCoords existe)
      if (userCoords) {
        fetchedRoutes = fetchedRoutes.map((route) => {
          if (!route.geometry?.coordinates?.length) {
            return { ...route, distance: Infinity };
          }
          // Usamos el primer punto de la ruta para estimar la distancia
          const [lng, lat] = route.geometry.coordinates[0];
          const dist = getDistance(
            { latitude: lat, longitude: lng },
            { latitude: userCoords.latitude, longitude: userCoords.longitude }
          );
          return { ...route, distance: dist }; // distancia en metros
        });

        // 4) Ordenar de menor a mayor distancia
        fetchedRoutes.sort((a, b) => a.distance - b.distance);
      }

      setRoutes(fetchedRoutes);
      setFilteredRoutes(fetchedRoutes);
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = routes.filter((route) => {
      const routeName = route.properties?.name?.toLowerCase() || "";
      return routeName.includes(text.toLowerCase());
    });
    setFilteredRoutes(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar ruta..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Lista de rutas usando el componente anterior */}
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : String(index)
        }
        renderItem={({ item }) => <Route routeData={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 8,
  },
  searchBar: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
});
