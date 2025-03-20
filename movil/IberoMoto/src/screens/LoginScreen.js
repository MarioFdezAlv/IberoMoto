import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../auth/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { authToken, setToken } = useAuth();
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  console.log("🟣 Entrando a LoginScreen, authToken:", authToken);

  // ✅ Si el usuario ya está autenticado, redirigirlo a su perfil automáticamente
  useEffect(() => {
    if (authToken) {
      console.log("🔵 Usuario ya autenticado, redirigiendo a Profile...");
      navigation.navigate("Profile"); // ✅ Cambio de replace a navigate
    }
  }, [authToken, navigation]);

  const handleLogin = async () => {
    console.log("🟢 Intentando iniciar sesión con:", loginData); // ✅ Verifica los datos enviados
    try {
      const response = await fetch("http://172.20.10.6:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        console.log("🟢 Login exitoso, guardando token...");
        setToken(data.access);
        navigation.navigate("Profile"); // ✅ Cambio de replace a navigate
      } else {
        console.log("❌ Usuario o contraseña incorrectos"); // ✅ Se elimina el Alert
      }
    } catch (error) {
      console.log("❌ No se pudo conectar con el servidor"); // ✅ Se elimina el Alert
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#A8A8A8"
        value={loginData.username}
        onChangeText={(text) => setLoginData({ ...loginData, username: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A8A8A8"
        secureTextEntry
        value={loginData.password}
        onChangeText={(text) => setLoginData({ ...loginData, password: text })}
      />
      <Button title="Ingresar" onPress={handleLogin} color="#E63946" />
    </View>
  );
};

// ✅ Definir Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    color: "#FFF",
    marginBottom: 15,
  },
});

export default LoginScreen;
