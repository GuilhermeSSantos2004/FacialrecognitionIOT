import React, { useState, useEffect, useContext, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import bcrypt from "bcryptjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { Toast } from "toastify-react-native";
import { Login } from "../../components/screen/Login";
import { UserContext } from "../../contexts/user-context";
import { LoginService } from "../../service/login/login-service";
import TabNavigator from "../../bottomTabNavigation/tabNavigation";
const Stack = createStackNavigator();

interface UserCredentials {
  userName: string;
  password: string;
}
const Navigation = () => {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "HomeTab" : "Login"}>
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="HomeTab"
          options={{ headerShown: false }}
          component={TabNavigator}  // TabNavigator aqui
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    height: 40,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  button: {
    marginLeft: 20,
    padding: 2,
  },
  syncText: {
    fontSize: 16,
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Navigation;
