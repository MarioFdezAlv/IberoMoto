import React from "react";
import { AuthProvider } from "./src/auth/AuthContext"; // Asegúrate de importar bien el contexto
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

const App = () => {
  return (
    <AuthProvider>
      <BottomTabNavigator />
    </AuthProvider>
  );
};

export default App;
