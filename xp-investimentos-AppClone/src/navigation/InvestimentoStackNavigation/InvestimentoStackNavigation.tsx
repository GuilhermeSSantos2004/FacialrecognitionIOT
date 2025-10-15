// FeedStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../components/screen/Home";
import ArticleDetail from "../../components/screen/ArticleDetails/Index";
import { CofrinhoParamList, FeedStackParamList, InvestimentoStackParamListType } from "../../types/types";
import { Cofrinho } from "../../components/screen/Cofrinho";
import CofrinhoCreate from "../../components/screen/CofrinhoCreate";
import CofrinhoDetailsScreen from "../../components/screen/CofrinhoDetails";
import InvestimentosHomeScreen from "../../components/screen/Investimento";
import InvestimentoDetailsScreen from "../../components/screen/InvestimentoDetails/Index";
import InvestimentoBuyScreen from "../../components/screen/InvestimentoBuy";
import InvestimentoSellScreen from "../../components/screen/InvestimentoSell/Index";
import InvestmentSearchScreen from "../../components/screen/InvestimentoSearch/Index";


const Stack = createNativeStackNavigator<InvestimentoStackParamListType>();

const InvestimentoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Investimento" component={InvestimentosHomeScreen} />
    <Stack.Screen name="InvestimentoDetails" component={InvestimentoDetailsScreen} />
    <Stack.Screen name="InvestimentoBuy" component={InvestimentoBuyScreen} />
    <Stack.Screen name="InvestimentoSell" component={InvestimentoSellScreen} />
    <Stack.Screen name="InvestimentoSearch" component={InvestmentSearchScreen} />


  </Stack.Navigator>
);

export default InvestimentoStack;
