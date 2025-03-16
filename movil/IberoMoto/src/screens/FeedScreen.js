import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Text,
} from "react-native";
import Post from "../components/Post"; // Ruta corregida si es necesario

const API_URL = "http://192.168.1.169:8000/api/feed/posts/";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      // Verifica el content-type antes de parsear
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta no es JSON válida");
      }

      const text = await response.text(); // Obtén el texto sin parsear aún
      console.log("📌 Respuesta en texto:", text);

      const data = JSON.parse(text); // Ahora sí parseamos
      console.log("📌 JSON final:", data);

      const processedPosts = data.map((post) => ({
        ...post,
        video:
          post.video && post.video.startsWith("/")
            ? `http://192.168.1.169:8000${post.video}`
            : post.video,
      }));

      setPosts(processedPosts);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los posts.");
      console.error("Error en fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#E63946" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <View style={styles.noPosts}>
              <Text style={{ color: "#FFF" }}>No hay posts disponibles</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingBottom: 70, // Espacio para la Navbar
  },
  noPosts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default FeedScreen;
