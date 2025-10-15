import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { Home } from "../components/screen/Home"
import { Conta } from "../components/screen/Conta"
import { Cofrinho } from "../components/screen/Cofrinho"
import FeedStack from "../navigation/FeedStackNavigation/feedStackNavigation"
import CofrinhoStack from "../navigation/CofrinhoStackNavigation/CofrinhoStackNavigation"
import InvestimentoStack from "../navigation/InvestimentoStackNavigation/InvestimentoStackNavigation"

// Placeholder components for the new screens
// You'll want to replace these with your actual screen components
const CarteiraScreen = () => null

const Tab = createBottomTabNavigator()


const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#2D2D2D", height: 60 },
        tabBarActiveTintColor: "#3366ff", // Brighter blue color for active tab
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          tabBarLabel: "Feed",
        }}
      />
      <Tab.Screen
        name="Cofrinho"
        component={CofrinhoStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet" color={color} size={size} />,
          tabBarLabel: "Cofrinho",
        }}
      />
      <Tab.Screen
        name="Conta"
        component={Conta}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="cash-outline" color={color} size={size} />,
          tabBarLabel: "Conta",
        }}
      />
<Tab.Screen
  name="Carteira"
  component={InvestimentoStack}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      e.preventDefault(); // Impede o comportamento padrão
      navigation.navigate("Carteira", {
        screen: "Investimento", // Força voltar à tela inicial da stack
      });
    },
  })}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="stats-chart" color={color} size={size} />
    ),
    tabBarLabel: "Carteira",
  }}
/>

    </Tab.Navigator>
  )
}

export default TabNavigator
