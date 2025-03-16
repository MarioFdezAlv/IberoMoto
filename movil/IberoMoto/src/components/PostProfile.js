import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { PostContext } from "../context/PostContext";

const PostProfile = () => {
  const { posts } = useContext(PostContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (posts.length > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [posts]);

  console.log("📌 Renderizando PostsTab con posts:", posts);

  return (
    <View style={styles.tabContent}>
      {!isLoaded ? (
        <ActivityIndicator size="large" color="#E63946" />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text style={styles.postUsername}>{item.user_username}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No tienes posts aún.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: { flex: 1, padding: 10, backgroundColor: "#121212" },
  post: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  postUsername: { color: "#E63946", fontWeight: "bold" },
  postContent: { color: "#fff" },
  noDataText: { color: "#A8A8A8", textAlign: "center", fontSize: 16 },
});

export default PostProfile;
