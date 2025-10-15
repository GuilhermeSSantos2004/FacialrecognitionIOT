// FeedStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../components/screen/Home";
import ArticleDetail from "../../components/screen/ArticleDetails/Index";
import { FeedStackParamList } from "../../types/types";


const Stack = createNativeStackNavigator<FeedStackParamList>();

const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="EducaArticleDetail" component={ArticleDetail} />
  </Stack.Navigator>
);

export default FeedStack;
