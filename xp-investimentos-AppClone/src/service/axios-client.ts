import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";
class AxiosClient {
  async buildAxiosWithHeaders(
    isFormData: boolean = false
  ): Promise<AxiosInstance> {
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3000/api",
    });

    // // Se for FormData, não define Content-Type manualmente
    if (!isFormData) {
      axiosInstance.defaults.headers["Content-Type"] = "application/json";
    }

    // Token
    const currentToken = (await AsyncStorage.getItem("token")) || "{}";
    const token = JSON.parse(currentToken);
    // console.log(token)

    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }

    // Interceptor (se necessário)
    axiosInstance.interceptors.request.use((config) => {
      return config;
    });

    return axiosInstance;
  }
}
export { AxiosClient };
