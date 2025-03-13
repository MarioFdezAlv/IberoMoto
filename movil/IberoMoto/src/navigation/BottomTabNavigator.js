import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import FeedScreen from "../screens/FeedScreen";
import RoutesScreen from "../screens/RoutesScreen";
import { MaterialIcons } from "@expo/vector-icons"; // Íconos de Expo

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Feed") {
              iconName = "home";
            } else if (route.name === "Routes") {
              iconName = "explore";
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: { backgroundColor: "#121212" }, // Color de fondo
          tabBarActiveTintColor: "#E63946", // Color del icono activo
          tabBarInactiveTintColor: "#A8A8A8", // Color del icono inactivo
        })}
      >
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Routes" component={RoutesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
