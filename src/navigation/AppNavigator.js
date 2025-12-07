import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CreateFlowScreen from "../screens/CreateFlowScreen";
import FeedScreen from "../screens/FeedScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import LoginScreen from "../screens/LoginScreen";
import MyTasksScreen from "../screens/MyTasksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainAppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Nouveau" component={CreateFlowScreen} />
      <Tab.Screen name="Tâches" component={MyTasksScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
