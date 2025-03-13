import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏍 Bienvenido a IberoMoto</Text>
      <Button title="Ver Rutas" onPress={() => navigation.navigate("Routes")} />
    </View>
  );
};

export default HomeScreen;
