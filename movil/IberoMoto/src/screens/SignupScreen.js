import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.169:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        Alert.alert("Registro Exitoso", "Ahora puedes iniciar sesión");
        navigation.replace("Login");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.error || "No se pudo completar el registro"
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
      />
      <Button title="Registrarse" onPress={handleRegister} color="#7b2cbf" />
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  link: { color: "#E63946", marginTop: 10, textAlign: "center" },
});

export default SignupScreen;
