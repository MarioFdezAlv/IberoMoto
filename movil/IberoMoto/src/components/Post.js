import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Video } from "expo-video"; // ✅ Importación correcta

const Post = ({ user_username, content, created_at, image, video }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🎥 Intentando cargar video desde:", video);
  }, [video]);

  return (
    <View style={styles.postContainer}>
      {/* Encabezado del Post */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>{user_username}</Text>
          <Text style={styles.date}>
            {new Date(created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Contenido del Post */}
      {content ? <Text style={styles.content}>{content}</Text> : null}

      {/* Mostrar imagen si existe */}
      {image && <Image source={{ uri: image }} style={styles.postImage} />}

      {/* Mostrar video si existe y es válido */}
      {video && video.trim() !== "" && (
        <View style={styles.videoContainer}>
          {isLoading && <ActivityIndicator size="large" color="#E63946" />}
          <Video
            ref={videoRef}
            source={{ uri: video }}
            style={styles.video}
            resizeMode="contain"
            loop
            onLoad={() => setIsLoading(false)}
            onError={(error) =>
              console.error("❌ Error cargando video:", error)
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  date: {
    fontSize: 12,
    color: "#A8A8A8",
  },
  content: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  videoContainer: {
    width: "100%",
    height: 250,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default Post;
