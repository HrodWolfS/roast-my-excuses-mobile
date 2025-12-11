import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";

// --- 1. NAVIGATION IMPORTS ---
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// --- 2. SCREEN IMPORTS ---
import CreateFlowScreen from "../screens/CreateFlowScreen";
import FeedScreen from "../screens/FeedScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import LoginScreen from "../screens/LoginScreen";
import MyTasksScreen from "../screens/MyTasksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";

// --- 3. CONFIGURATION ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Composant vide pour l'interception du clic sur "Nouveau"
const NullComponent = () => null;

// --- 4. DÉFINITION DES TABS (INTERNE AU FICHIER) ---
function MainAppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />

      {/* Bouton central qui ouvre la modale */}
      <Tab.Screen
        name="Nouveau"
        component={NullComponent}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Empêche d'ouvrir l'onglet vide
            navigation.navigate("CreateFlow"); // Ouvre la modale
          },
        })}
        options={{
          tabBarLabel: "Nouveau",
        }}
      />

      <Tab.Screen name="Tâches" component={MyTasksScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 5. NAVIGATEUR PRINCIPAL (EXPORT) ---
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
          // --- UTILISATEUR CONNECTÉ ---
          <>
            <Stack.Screen name="Main" component={MainAppTabs} />
            {/* Groupe Modale, s'affiche par-dessus tout */}
            <Stack.Group
              screenOptions={{ presentation: "modal", headerShown: false }}
            >
              <Stack.Screen name="CreateFlow" component={CreateFlowScreen} />
            </Stack.Group>
          </>
        ) : (
          // --- UTILISATEUR NON CONNECTÉ ---
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
