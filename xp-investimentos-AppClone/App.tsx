import { useEffect } from "react";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { GlobalContext } from "./src/contexts/global-context";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import Navigator from "./src/navigation/Navigation/navigation";
import "react-native-gesture-handler";
import ToastManager from "toastify-react-native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8D8D99",
  },
};

export default function App() {

  return (
    <PaperProvider>
      <GlobalContext>
        <ToastManager
          style={{
            fontSize: 12,
            height: 150,
            padding: 15,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <Navigator />
      </GlobalContext>
    </PaperProvider>
  );
}
