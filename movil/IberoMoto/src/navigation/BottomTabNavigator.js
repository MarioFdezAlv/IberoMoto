// src/navigation/BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../auth/AuthContext";

// 🔸 Importa el Stack de rutas
import RoutesStackNavigator from "./RoutesStackNavigator";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { authToken, loading } = useAuth();

  if (loading) {
    return null; // o algún indicador de carga
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Feed") iconName = "home";
            else if (route.name === "Routes") iconName = "explore";
            else if (route.name === "Profile")
              iconName = authToken ? "person" : "login";

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: { backgroundColor: "#121212" },
          tabBarActiveTintColor: "#E63946",
          tabBarInactiveTintColor: "#A8A8A8",
        })}
      >
        <Tab.Screen name="Feed" component={FeedScreen} />
        {/* Cambiamos la pantalla de rutas por la Stack */}
        <Tab.Screen
          name="Routes"
          component={RoutesStackNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={authToken ? ProfileScreen : LoginScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
