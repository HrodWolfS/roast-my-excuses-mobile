import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, View } from "react-native";
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

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// --- 3. CONFIGURATION ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Composant vide pour l'interception du clic sur "Nouveau"
const NullComponent = () => null;

// --- COMPOSANT BOUTON PULSANT ---
const PulsingAddButton = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return (
    <View
      style={{
        width: 82,
        height: 82,
        borderRadius: 50,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 60,
        zIndex: 10,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Neon Glow Ring */}
        <View
          style={{
            position: "absolute",
            width: 82,
            height: 82,
            borderRadius: 41,
            borderWidth: 2,
            borderColor: "#bef264",
            shadowColor: "#bef264",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 10,
          }}
        />
        <LinearGradient
          colors={["#bef264", "#22d3ee"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: "#0f172a",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#bef264",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={55} color="#0f172a" />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// --- 4. DÉFINITION DES TABS (INTERNE AU FICHIER) ---
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#bef264",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      {/* Bouton central qui ouvre la modale */}
      <Tab.Screen
        name="Nouveau"
        component={NullComponent}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("CreateFlow");
          },
        })}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => <PulsingAddButton />,
        }}
      />

      <Tab.Screen
        name="Tâches"
        component={MyTasksScreen}
        options={{
          tabBarLabel: "Tâches",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
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
