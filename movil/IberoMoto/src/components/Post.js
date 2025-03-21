import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Video } from "expo-av";

// Importa la imagen local por defecto
const defaultUserImage = require("../../assets/user.jpg");

const Post = ({
  user_username,
  user_profile_image,
  content,
  created_at,
  image,
  video,
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🎥 Intentando cargar video desde:", video);
  }, [video]);

  // Determina la fuente de la imagen de perfil: si no existe user_profile_image,
  // se recurre a la imagen local por defecto
  const profileSource = user_profile_image
    ? { uri: user_profile_image }
    : defaultUserImage;

  return (
    <View style={styles.postContainer}>
      {/* Encabezado del Post */}
      <View style={styles.header}>
        <Image source={profileSource} style={styles.avatar} />
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
            isLooping
            shouldPlay
            useNativeControls
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={(error) => {
              setIsLoading(false);
              console.error("❌ Error cargando video:", error);
            }}
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
    // Para que sea circular, debe ser la mitad del ancho/alto
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
