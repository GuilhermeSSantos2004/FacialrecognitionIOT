import React from "react";
import { View } from "react-native";
import { UserProvider } from "./user-context";
interface GlobalContextProps {
  children: React.ReactNode;
}

export const GlobalContext: React.FC<GlobalContextProps> = ({ children }) => {
  return (
  <UserProvider>
    { children }
    </UserProvider>
  );
};
