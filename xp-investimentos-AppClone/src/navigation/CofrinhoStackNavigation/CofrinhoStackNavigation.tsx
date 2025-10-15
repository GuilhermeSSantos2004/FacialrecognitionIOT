// FeedStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../components/screen/Home";
import ArticleDetail from "../../components/screen/ArticleDetails/Index";
import { CofrinhoParamList, FeedStackParamList } from "../../types/types";
import { Cofrinho } from "../../components/screen/Cofrinho";
import CofrinhoCreate from "../../components/screen/CofrinhoCreate";
import CofrinhoDetailsScreen from "../../components/screen/CofrinhoDetails";


const Stack = createNativeStackNavigator<CofrinhoParamList>();

const CofrinhoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Cofre" component={Cofrinho} />
    <Stack.Screen name="Cadastro" component={CofrinhoCreate} />
    <Stack.Screen name="CofrinhoDetails" component={CofrinhoDetailsScreen} />

  </Stack.Navigator>
);

export default CofrinhoStack;
