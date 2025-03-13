import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <MaterialIcons name="home" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Routes")}>
        <MaterialIcons name="explore" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Market")}>
        <MaterialIcons name="store" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("News")}>
        <MaterialIcons name="announcement" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <MaterialIcons name="person" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    paddingVertical: 10,
  },
});

export default Navbar;
