// src/navigation/RoutesStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutesScreen from "../screens/RoutesScreen"; // El mapa
import RoutesListScreen from "../screens/RoutesListScreen"; // La lista

const Stack = createNativeStackNavigator();

export default function RoutesStackNavigator() {
  return (
    <Stack.Navigator>
      {/* Pantalla principal de rutas (mapa) */}
      <Stack.Screen
        name="RoutesMap"
        component={RoutesScreen}
        options={{ title: "Mapa de Rutas" }}
      />
      {/* Pantalla de lista de rutas */}
      <Stack.Screen
        name="RoutesList"
        component={RoutesListScreen}
        options={{ title: "Listado de Rutas" }}
      />
    </Stack.Navigator>
  );
}
