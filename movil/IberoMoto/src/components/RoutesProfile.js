// src/components/RoutesView.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAuth } from "../auth/AuthContext";

// Ajusta a tu IP/URL:
const BASE_URL = "http://192.168.1.169:8000";

const RoutesProfile = () => {
  const { getToken } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.log("No hay token para rutas");
          setLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/api/user/routes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.log("Error en rutas:", res.status, await res.text());
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log("Routes data:", data);
        // data es {type: 'FeatureCollection', features: [ ... ]}
        setRoutes(data.features || []);
      } catch (error) {
        console.log("Error al cargar rutas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRoutes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  if (routes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noDataText}>No hay rutas aún</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.usernameText}>
              {item.properties?.name || "Ruta sin nombre"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "#A8A8A8",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  itemBox: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  usernameText: {
    color: "#E63946",
    fontWeight: "bold",
  },
});

export default RoutesProfile;
