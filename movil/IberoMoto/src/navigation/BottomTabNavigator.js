import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import FeedScreen from "../screens/FeedScreen";
import RoutesScreen from "../screens/RoutesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../auth/AuthContext";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { authToken, loading } = useAuth();

  console.log("🟡 Estado actual de authToken:", authToken);

  if (loading) {
    console.log("⏳ Esperando que termine la carga de authToken...");
    return null; // 🔹 Evita que la app se renderice antes de verificar el token
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
        <Tab.Screen name="Routes" component={RoutesScreen} />
        <Tab.Screen
          name="Profile"
          component={authToken ? ProfileScreen : LoginScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
