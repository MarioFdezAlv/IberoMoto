// src/components/PostProfile.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import Post from "./Post"; // Se importa el nuevo componente Post

// Ajusta la IP/URL a tu backend
const BASE_URL = "http://172.20.10.6:8000";

const PostProfile = () => {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.log("No hay token para cargar posts");
          setLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/api/feed/user/posts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.log("Error al cargar posts:", res.status, await res.text());
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log("Posts data:", data);
        // 'data' se asume que es un array con user_profile_image
        setPosts(data);
      } catch (error) {
        console.log("Error al cargar posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noDataText}>No hay posts aún.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Post
            user_username={item.user_username}
            user_profile_image={item.user_profile_image} // <--- AQUÍ
            content={item.content}
            created_at={item.created_at}
            image={item.image}
            video={item.video}
          />
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
  listContainer: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
});

export default PostProfile;
