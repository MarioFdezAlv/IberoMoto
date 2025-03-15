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

const API_URL = "http://192.168.1.169:8000/feed/posts/";

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
      if (!response.ok) throw new Error("Error al obtener los posts");

      const data = await response.json();

      // Asegurar que las URLs sean absolutas
      const processedPosts = data.map((post) => ({
        ...post,
        video:
          post.video && post.video.startsWith("/")
            ? `http://192.168.1.169:8000${post.video}`
            : post.video,
      }));

      console.log("📌 Posts procesados:", processedPosts);
      setPosts(processedPosts);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los posts.");
      console.error(error);
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
