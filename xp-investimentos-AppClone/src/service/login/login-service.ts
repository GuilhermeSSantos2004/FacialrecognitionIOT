import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosClient } from "../axios-client";
import { LoginResponse, LoginRequest } from "./login-service-protocol";
import { useCache } from "../useCache";

export class LoginService {
    private path: string;

    private axiosClientWrapper: AxiosClient;

    constructor() {
        this.path = `/auth/login`;
        this.axiosClientWrapper = new AxiosClient()
      }
      
      // async login(auth: LoginRequest): Promise<any> {
        //   const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
        //   const response = await axiosInstance.post(this.path,{
          //     login: auth.userName,
          //     password: auth.password
          //   });
          //   console.log(response.data);
          //   return response.data;
          // }
          
          
          // async validateUser(token: string): Promise<any> {
            //     (await this.axiosClientWrapper.buildAxiosWithHeaders()).defaults.headers["Authorization"] = `Bearer ${token}`
            
            //     const response = await (await this.axiosClientWrapper.buildAxiosWithHeaders()).get('/profile')
            //     return response.data
            // }
            private mockUser = {
              id: 1,
              name: "Usuário Mock",
              cpf: "111",
            };
            
            private mockToken = "mocked-token-123456";
            
            async login(auth: LoginRequest): Promise<LoginResponse> {
              try {
                const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
                const response = await axiosInstance.post(this.path, {
                  username: auth.userName,
                  password: auth.password
                });

                const { token, user } = response.data;

                // Salvar token no AsyncStorage
                await AsyncStorage.setItem("token", JSON.stringify(token));

                return {
                  id: user.id,
                  cpf: user.email || "",
                  name: user.username,
                  token: token
                };
              } catch (error: any) {
                console.error("Erro no login:", error.response?.data || error.message);
                throw new Error(error.response?.data?.error || "Erro ao fazer login");
              }
      }
    
    //   async validateUser(token: string): Promise<any> {
    //     if (token === this.mockToken) {
    //       return this.mockUser;
    //     } else {
    //       throw new Error("Token inválido");
    //     }
    //   }
}