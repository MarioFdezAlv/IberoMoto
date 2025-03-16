import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { RouteContext } from "../context/RouteContext";

const RouteProfile = () => {
  const { routes } = useContext(RouteContext);
  const [localRoutes, setLocalRoutes] = useState([]);

  useEffect(() => {
    if (routes.length > 0) {
      setLocalRoutes(routes);
    }
  }, [routes]);

  console.log("📍 Renderizando RoutesTab con routes:", localRoutes);

  return (
    <View style={styles.tabContent}>
      {localRoutes.length === 0 ? (
        <ActivityIndicator size="large" color="#E63946" />
      ) : (
        <FlatList
          data={localRoutes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.routeItem}>
                <Text style={styles.routeName}>
                  {item.properties?.name ?? "Ruta sin nombre"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: { flex: 1, padding: 10, backgroundColor: "#121212" },
  routeItem: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  routeName: { color: "#E63946", fontWeight: "bold" },
  noDataText: { color: "#A8A8A8", textAlign: "center", fontSize: 16 },
});

export default RouteProfile;
