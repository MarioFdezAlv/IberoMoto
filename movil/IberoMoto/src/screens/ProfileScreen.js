import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SceneMap, TabView, TabBar } from "react-native-tab-view";
import { PostContext } from "../context/PostContext";
import { RouteContext } from "../context/RouteContext";
import PostProfile from "../components/PostProfile";
import RouteProfile from "../components/RouteProfile";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { getToken, clearToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      let token = await getToken();
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      try {
        setLoading(true);
        const profileResponse = await fetch(
          "http://192.168.1.169:8000/api/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileResponse.ok) {
          setUserData(await profileResponse.json());
        }
      } catch (error) {
        console.error("❌ Error obteniendo datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const loadPosts = async () => {
    let token = await getToken();
    try {
      setLoading(true);
      const postsResponse = await fetch(
        "http://192.168.1.169:8000/api/feed/user/posts/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        console.log("✅ Posts cargados:", postsData);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } else {
        setPosts([]); // 🔥 Asegurar que se actualiza aunque falle la petición
      }
    } catch (error) {
      console.error("❌ Error obteniendo posts:", error);
      setPosts([]); // 🔥 Evitar que el estado se quede atrapado
    } finally {
      console.log("✅ Finalizando carga de posts");
      setLoading(false); // 🔥 Asegurar que la carga termina
    }
  };

  const loadRoutes = async () => {
    let token = await getToken();
    try {
      setLoading(true);
      const routesResponse = await fetch(
        "http://192.168.1.169:8000/api/user/routes/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (routesResponse.ok) {
        const routesData = await routesResponse.json();
        console.log("📍 Rutas cargadas:", routesData);
        setRoutes(
          Array.isArray(routesData.features) ? routesData.features : []
        );
      } else {
        setRoutes([]); // 🔥 Asegurar que se actualiza aunque falle la petición
      }
    } catch (error) {
      console.error("❌ Error obteniendo rutas:", error);
      setRoutes([]); // 🔥 Evitar que el estado se quede atrapado
    } finally {
      console.log("✅ Finalizando carga de rutas");
      setLoading(false); // 🔥 Asegurar que la carga termina
    }
  };

  const handleTabChange = (newIndex) => {
    setIndex(newIndex);

    if (newIndex === 0) {
      console.log("📝 Cargando Posts - Eliminando Rutas...");
      setRoutes([]); // 🔥 Limpia rutas solo cuando se entra en Posts
      loadPosts();
    } else if (newIndex === 1) {
      console.log("📍 Cargando Rutas - Eliminando Posts...");
      setPosts([]); // 🔥 Limpia posts solo cuando se entra en Rutas
      loadRoutes();
    }

    setRefreshKey((prev) => prev + 1); // 🔥 Forzar re-render
  };

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      <RouteContext.Provider value={{ routes, setRoutes }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.logoutButton} onPress={clearToken}>
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <Image
              source={{
                uri:
                  userData?.profile_image || "https://via.placeholder.com/100",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>
              {userData?.first_name || userData?.username || "Cargando..."}
            </Text>
          </View>

          <TabView
            key={refreshKey} // 🔥 Forzar render después de cambio de pestaña
            navigationState={{
              index,
              routes: [
                { key: "posts", title: "Posts" },
                { key: "rutas", title: "Rutas" },
              ],
            }}
            renderScene={({ route }) => {
              if (route.key === "posts") return <PostProfile />;
              if (route.key === "rutas") return <RouteProfile />;
              return null;
            }}
            onIndexChange={handleTabChange}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={styles.tabBar}
                indicatorStyle={styles.indicator}
                labelStyle={styles.tabLabel}
              />
            )}
          />
        </View>
      </RouteContext.Provider>
    </PostContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  tabBar: {
    backgroundColor: "#222",
  },
  indicator: {
    backgroundColor: "#E63946",
  },
  tabLabel: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
