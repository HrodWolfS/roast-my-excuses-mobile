import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
  TextInput,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../redux/slices/authSlice";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

// --- MAPPING DES IMAGES DE LIGUE ---
const leagueImages = {
  Bronze: require("../assets/leagues/ProFlemmard.png"),
  Silver: require("../assets/leagues/ProCrastinateur.png"),
  Gold: require("../assets/leagues/ProDeborde.png"),
  Diamond: require("../assets/leagues/ProActif.png"),
  // Fallback
  default: require("../assets/leagues/ProEndormi.png"),
};

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // <--- INITIALISATION DU HOOK

  // --- STATES ---
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [modalVisible, setModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [searchCode, setSearchCode] = useState("");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users/me");

      const userData = response.data.data || response.data;
      setUserProfile(userData);

      if (userData.isPublic !== undefined) setIsPublic(userData.isPublic);
    } catch (error) {
      console.error("Erreur profile", error);
      Alert.alert("Oups", "Impossible de charger ton profil.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    setModalVisible(false);
    dispatch(logout());
  };

  const toggleSwitch = () => {
    setIsPublic((prev) => !prev);
  };

  const copyToClipboard = async () => {
    if (userProfile?.friendCode) {
      await Clipboard.setStringAsync(userProfile.friendCode);
      Alert.alert("Copié !", "Code ami dans le presse-papiers.");
    }
  };

  const handleSearchFriend = () => {
    if (searchCode.length < 6) {
      Alert.alert("Erreur", "Le code doit faire 6 caractères.");
      return;
    }

    // la recherche
    Alert.alert("Recherche", `On cherche le joueur : ${searchCode}`);
    setSearchCode("");
  };

  // Helper pour naviguer et fermer la modale
  const navigateFromModal = (screenName) => {
    setModalVisible(false);
    navigation.navigate(screenName);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!userProfile) return null;

  const currentLeagueImage =
    leagueImages[userProfile.currentLeague] || leagueImages.default;

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.mainContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="settings-sharp" size={26} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- BLOC PROFIL --- */}
          <View style={styles.profileCard}>
            <Text style={styles.userName}>
              {userProfile.userName || "Pseudo Inconnu"}
            </Text>

            <Image
              source={currentLeagueImage}
              style={styles.leagueBanner}
              resizeMode="contain"
            />

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.level}</Text>
                <Text style={styles.statLabel}>Niveau</Text>
              </View>
            </View>
          </View>

          {/* --- BLOC SOCIAL --- */}
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Ton Code Ami</Text>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.myCodeBox}
            >
              <Text style={styles.codeText}>{userProfile.friendCode}</Text>
              <Ionicons
                name="copy-outline"
                size={20}
                color="#555"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Ajouter un Ami</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Code Ami (ex: B4N1E7)"
                placeholderTextColor="#999"
                value={searchCode}
                onChangeText={(text) => setSearchCode(text.toUpperCase())}
                maxLength={6}
              />
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleSearchFriend}
              >
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* --- MODAL PARAMETRES --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Paramètres</Text>

              {/* Option Profil Public */}
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>Profil Public</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FFD700" }}
                  thumbColor={"#f4f3f4"}
                  onValueChange={toggleSwitch}
                  value={isPublic}
                />
              </View>
              <Text style={styles.settingSubtext}>
                Tes roasts seront visible dans le Feed.
              </Text>

              <View style={styles.modalDivider} />

              {/* --- AJOUT DES LIENS LEGAUX --- */}
              <View style={{ width: "100%", marginBottom: 15 }}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigateFromModal("Terms")}
                >
                  <Text style={styles.menuItemText}>
                    Conditions Générales (CGU)
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigateFromModal("Privacy")}
                >
                  <Text style={styles.menuItemText}>
                    Politique de Confidentialité
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigateFromModal("About")}
                >
                  <Text style={styles.menuItemText}>À propos & Crédits</Text>
                  <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    paddingTop: 50,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginBottom: 10,
    position: "relative",
  },
  logo: {
    height: 60,
    width: 160,
  },
  settingsBtn: {
    position: "absolute",
    right: 20,
    padding: 5,
  },

  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
  },

  // PROFILE CARD
  profileCard: {
    width: "90%",
    alignItems: "center",
    marginBottom: 30,
  },
  userName: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  leagueBanner: {
    width: "100%",
    height: 150,
    alignSelf: "center",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: "100%",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
  },
  statLabel: {
    fontSize: 13,
    color: "#718096",
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    height: "80%",
    alignSelf: "center",
  },

  // SOCIAL SECTION
  socialSection: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
    marginLeft: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  myCodeBox: {
    flexDirection: "row",
    backgroundColor: "#EDF2F7",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  codeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
    letterSpacing: 2,
  },
  searchBox: {
    flexDirection: "row",
    height: 50,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  searchBtn: {
    backgroundColor: "#2D3748",
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%", // Légèrement plus large pour les textes
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2D3748",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
  settingText: {
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "600",
  },
  settingSubtext: {
    fontSize: 12,
    color: "#A0AEC0",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  modalDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  // NOUVEAUX STYLES POUR LES BOUTONS LEGAUX
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  menuItemText: {
    fontSize: 15,
    color: "#4A5568",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#FFF5F5",
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  logoutText: {
    color: "#E53E3E",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeModalBtn: {
    padding: 10,
  },
  closeText: {
    color: "#718096",
    fontSize: 14,
  },
});
