import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Toast } from "toastify-react-native";
import { LoginService } from "../../../service/login/login-service";
import { UserContext } from "../../../contexts/user-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamListType } from "../../../types/types";
import logo from "../../../../assets/img/logo.png"
import { useCache } from "../../../service/useCache";
interface UserCredentials {
  userName: string;
  password: string;
}

type NavigationProp = StackNavigationProp<RootStackParamListType, "Login">;

export const Login = () => {
  const loginService = new LoginService();
  const { setUserCredentialsContext } = useContext(UserContext);
  const { piggyBanks, piggyTransfers, loading, initializeData, refreshCache } = useCache();

  const [users, setUsers] = useState<UserCredentials>({
    userName: "",
    password: "",
  });
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    const { userName, password } = users;
    const user = await loginService.login({ userName, password }); 
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserCredentialsContext(user);
      initializeData()
      navigation.replace("HomeTab");
    } else {
      Toast.error("Usuário ou senha inválidos");
    }
  };

  const validateToken = async () => {
    const tokenStorage = await AsyncStorage.getItem("token");
    const token = tokenStorage ? tokenStorage.toString() : "";
    const userStorage = await AsyncStorage.getItem("user");
    const user = userStorage ? JSON.parse(userStorage) : null;

    // await loginService
    //   .validateUser(token)
    //   .then(() => {
    //     setUserCredentialsContext(user);
    //     navigation.replace("HomeTab");
    //   })
    //   .catch(() => {
    //     AsyncStorage.removeItem("user");
    //     AsyncStorage.removeItem("token");
    //   });
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={logo}
        style={styles.logo}
      />

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Login"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={users.userName}
          onChangeText={(text) => setUsers({ ...users, userName: text })}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={users.password}
          onChangeText={(text) => setUsers({ ...users, password: text })}
        />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.registerText}>
        Ainda não é cliente?{" "}
        <Text style={styles.linkText}>Abra sua conta!</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  formContainer: {
    paddingVertical: "15%",
    width: "100%",
    backgroundColor: "#131518",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 15,
    fontSize: 20,
    width: "80%",
    height: 60,
    marginVertical: 10,
  },
  forgotText: {
    color: "#aaa",
    fontSize: 11,
    marginBottom: 20,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#362FFA",
    borderRadius: 16,
    padding: 15,
    width: 160,
    height: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    color: "#888",
    fontSize: 13,
  },
  linkText: {
    color: "#3f3fff",
    textDecorationLine: "underline",
  },
});
