import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [authRol, setAuthRol] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        console.log("🔍 Token almacenado en AsyncStorage:", storedToken);

        if (storedToken) {
          decodeToken(storedToken);
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.error("❌ Error cargando datos de autenticación:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const setToken = async (token) => {
    console.log("✅ Guardando nuevo token:", token);
    setAuthToken(token);
    await AsyncStorage.setItem("authToken", token);
    decodeToken(token);
  };

  const getToken = async () => {
    return authToken || (await AsyncStorage.getItem("authToken"));
  };

  const setUser = async (user) => {
    console.log("✅ Guardando usuario:", user);
    setAuthUser(user);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  const getUser = async () => {
    if (authUser) return authUser;
    const storedUser = await AsyncStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const setRol = async (rol) => {
    setAuthRol(rol);
    await AsyncStorage.setItem("rol", JSON.stringify(rol));
  };

  const getRol = async () => {
    return authRol || JSON.parse((await AsyncStorage.getItem("rol")) || "null");
  };

  const setId = async (id) => {
    console.log("✅ Guardando ID de usuario:", id);
    setUserId(id);
    await AsyncStorage.setItem("userId", id.toString());
  };

  const getId = async () => {
    return userId || (await AsyncStorage.getItem("userId"));
  };

  const clearToken = async () => {
    console.log("🚫 Cerrando sesión y eliminando datos");
    setAuthToken(null);
    setAuthUser(null);
    setAuthRol(null);
    setUserId(null);

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("rol");
    await AsyncStorage.removeItem("userId");
  };

  const decodeToken = async (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("🟢 Token decodificado:", decoded);

      if (decoded.user_id) {
        await setUser(decoded.user_id);
        await setId(decoded.user_id);
      } else {
        console.error("❌ Token no contiene 'user_id'");
        await clearToken();
      }

      if (
        decoded.role &&
        Array.isArray(decoded.role) &&
        decoded.role.length > 0
      ) {
        await setRol(decoded.role[0].authority);
      } else {
        await setRol(null);
      }
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      await clearToken();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setToken,
        getToken,
        authUser,
        setUser,
        getUser,
        authRol,
        setRol,
        getRol,
        userId,
        setId,
        getId,
        clearToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
