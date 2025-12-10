import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// --- IMPORTS DES ÉCRANS ---
import CreateFlowScreen from "../screens/CreateFlowScreen";
import FeedScreen from "../screens/FeedScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import LoginScreen from "../screens/LoginScreen";
import MyTasksScreen from "../screens/MyTasksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Nouveaux imports
import RoastResultScreen from "../screens/RoastResultScreen";
import FocusScreen from "../screens/FocusScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// La barre de navigation du bas (L'application principale)
function MainAppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Nouveau" component={CreateFlowScreen} />
      <Tab.Screen name="Tâches" component={MyTasksScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
      
      {/* 👇 ONGLET DE TEST TEMPORAIRE 👇 */}
      <Tab.Screen 
        name="TestRoast" 
        component={RoastResultScreen}
        options={{ tabBarLabel: "🧪 TEST" }} 
      />
    </Tab.Navigator>
  );
}

// ⚠️ C'est cette fonction qui manquait ou était mal exportée
export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f172a",
        }}
      >
        <ActivityIndicator size="large" color="#bef264" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // --- ZONE AUTHENTIFIÉE ---
          <>
            <Stack.Screen name="Main" component={MainAppTabs} />
            <Stack.Screen 
              name="RoastResult" 
              component={RoastResultScreen} 
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Focus" component={FocusScreen} />
          </>
        ) : (
          // --- ZONE NON AUTHENTIFIÉE ---
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}