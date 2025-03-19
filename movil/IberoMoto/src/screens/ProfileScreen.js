import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../auth/AuthContext";

// Importamos los componentes
import PostsProfile from "../components/PostsProfile";
import RoutesProfile from "../components/RoutesProfile";

// Importa la imagen local por defecto
const defaultUserImage = require("../../assets/user.jpg");

// Ajusta a tu IP/URL:
const BASE_URL = "http://192.168.1.169:8000";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { getToken, clearToken } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Este estado controla cuál de las dos vistas mostramos
  const [showPosts, setShowPosts] = useState(true);

  // Cargamos el perfil al montar
  useEffect(() => {
    const loadProfile = async () => {
      const token = await getToken();
      if (!token) {
        navigation.navigate("Login");
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/api/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.log("Error al cargar perfil:", res.status, await res.text());
          return;
        }
        const data = await res.json();
        console.log("Perfil:", data);
        setUserData({
          ...data,
          profile_image: data.profile_image
            ? `${BASE_URL}${data.profile_image}`
            : null,
        });
      } catch (error) {
        console.log("Error al cargar perfil:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  // Mientras cargamos perfil
  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  // Determina la fuente de la imagen de perfil: si no existe userData.profile_image,
  // usamos la imagen local por defecto
  const profileSource = userData?.profile_image
    ? { uri: userData.profile_image }
    : defaultUserImage;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={clearToken}>
        <MaterialIcons name="logout" size={24} color="white" />
      </TouchableOpacity>

      {/* Cabecera de perfil */}
      <View style={styles.profileHeader}>
        <Image source={profileSource} style={styles.profileImage} />
        <Text style={styles.username}>
          {userData?.first_name || userData?.username || "Cargando..."}
        </Text>
      </View>

      {/* Dos botones para cambiar la vista */}
      <View style={styles.buttonRow}>
        <Button
          title="Ver Posts"
          onPress={() => setShowPosts(true)}
          color="#E63946"
        />
        <Button
          title="Ver Rutas"
          onPress={() => setShowPosts(false)}
          color="#E63946"
        />
      </View>

      {/* Según showPosts, montamos <PostsProfile /> o <RoutesProfile /> */}
      {showPosts ? <PostsProfile /> : <RoutesProfile />}
    </View>
  );
};

const styles = StyleSheet.create({
  //////////////////////////////////////////////////
  // LAYOUT GENERAL
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },

  //////////////////////////////////////////////////
  // PERFIL
  profileHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    // Para que sea circular
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#E63946",
    padding: 10,
    borderRadius: 8,
  },

  //////////////////////////////////////////////////
  // BOTONES
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  //////////////////////////////////////////////////
  // TEXTOS
  noDataText: {
    color: "#A8A8A8",
    fontSize: 16,
  },
});

export default ProfileScreen;
