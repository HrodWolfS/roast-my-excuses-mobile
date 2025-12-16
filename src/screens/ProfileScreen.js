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
import { logout } from "../redux/slices/authSlice";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { LinearGradient } from "expo-linear-gradient";

// --- MAPPING DES IMAGES DE LIGUE ---
const leagueImages = {
  Bronze: require("../assets/leagues/ProFlemmard.png"),
  Silver: require("../assets/leagues/ProEndormi.png"),
  Gold: require("../assets/leagues/ProDeborde.png"),
  Diamond: require("../assets/leagues/ProActif.png"),
  default: require("../assets/leagues/ProEndormi.png"),
};

// Couleurs constantes pour éviter de recréer les strings à chaque render
const NEON_CYAN = "#22d3ee";
const NEON_GREEN = "#c9ff53";
const DARK_BG = "#040b16";
const DARK_CARD = "#0f172ad9";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  // --- STATES ---
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [modalVisible, setModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [searchCode, setSearchCode] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/me");
      const userData =
        response.data.data || response.data.user || response.data;

      if (!userData || !userData.userName) {
        setUserProfile({
          userName: "Pseudo Inconnu",
          points: 0,
          level: 1,
          currentLeague: "Bronze",
          friendCode: "?????",
        });
      } else {
        setUserProfile(userData);
        if (userData.isPublic !== undefined) setIsPublic(userData.isPublic);
      }
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
    Alert.alert("Recherche", `On cherche le joueur : ${searchCode}`);
    setSearchCode("");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEON_CYAN} />
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
      backgroundColor={DARK_BG}
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
            <Ionicons name="settings-sharp" size={26} color={NEON_CYAN} />
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

            {/* --- GRILLE STATS 2x2 --- */}
            <LinearGradient
              colors={[NEON_CYAN, NEON_GREEN]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.neonBorderContainer}
            >
              <View style={styles.statsContainer}>

                {/* LIGNE 1 : Points & Niveau */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userProfile.points}</Text>
                    <Text style={styles.statLabel}>Points</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userProfile.level}</Text>
                    <Text style={styles.statLabel}>Niveau</Text>
                  </View>
                </View>

                {/* SÉPARATEUR HORIZONTAL */}
                <View style={styles.horizontalDivider} />

                {/* LIGNE 2 : Streak & Tâches */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {userProfile.streak || 0}{" "}
                    </Text>
                    <Text style={styles.statLabel}>Série jour</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {userProfile.tasksCompleted || 0}{" "}
                    </Text>
                    <Text style={styles.statLabel}>Tâches finies</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* --- BLOC SOCIAL (STYLE NÉON) --- */}
          <LinearGradient
            colors={[NEON_GREEN, NEON_CYAN]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.neonBorderContainerSocial}
          >
            <View style={styles.socialSectionInner}>
              <Text style={styles.sectionTitle}>Ton Code Ami</Text>
              <TouchableOpacity
                onPress={copyToClipboard}
                style={styles.myCodeBox}
              >
                <Text style={styles.codeText}>{userProfile.friendCode}</Text>
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={NEON_CYAN}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>

              <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
                Ajouter un Ami
              </Text>
              <View style={styles.searchBoxWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Code Ami (ex: B4N1E7)"
                  placeholderTextColor={"#94a3b8"}
                  value={searchCode}
                  onChangeText={(text) => setSearchCode(text.toUpperCase())}
                  maxLength={6}
                />
                <TouchableOpacity onPress={handleSearchFriend}>
                  <LinearGradient
                    colors={[NEON_CYAN, NEON_GREEN]}
                    style={styles.searchBtnGradient}
                  >
                    <Ionicons name="search" size={24} color="#0f172a" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>

        {/* --- MODAL PARAMETRES --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Paramètres</Text>
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>Profil Public</Text>
                <Switch
                  trackColor={{ false: "#767577", true: NEON_CYAN }}
                  thumbColor={"#f4f3f4"}
                  onValueChange={toggleSwitch}
                  value={isPublic}
                />
              </View>
              <Text style={styles.settingSubtext}>
                Tes roasts seront visible dans le Feed.
              </Text>
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
    backgroundColor: DARK_BG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DARK_BG,
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
  },
  logo: {
    height: 60,
    width: 160,
  },
  settingsBtn: {
    position: "absolute",
    right: 20,
    padding: 5,
    shadowColor: NEON_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: "center",
  },

  // PROFILE CARD
  profileCard: {
    width: "90%",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#75edffff",
    letterSpacing: 1,
    textShadowColor: NEON_CYAN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  leagueBanner: {
    width: "100%",
    height: 120,
    alignSelf: "center",
  },

  // --- STYLES STATS 2x2 ---
  neonBorderContainer: {
    width: "100%",
    borderRadius: 20,
    padding: 1.5,
    shadowColor: NEON_CYAN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, 
    shadowRadius: 6,
    elevation: 4,
  },
  statsContainer: {
    backgroundColor: DARK_CARD,
    borderRadius: 19,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  statItem: {
    alignItems: "center",
    width: "40%",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: NEON_CYAN,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#ffffff1a",
    height: "60%",
  },
  horizontalDivider: {
    width: "80%",
    height: 1,
    backgroundColor: "#ffffff1a",
    marginVertical: 5,
  },

  // --- STYLES SOCIAL SECTION ---
  neonBorderContainerSocial: {
    width: "90%",
    borderRadius: 20,
    padding: 1.5,
    marginTop: 5,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  socialSectionInner: {
    backgroundColor: DARK_CARD,
    padding: 25,
    borderRadius: 19,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "white",
    marginBottom: 5,
    marginLeft: 4,
  },
  myCodeBox: {
    flexDirection: "row",
    backgroundColor: "#ffffff0d",
    borderWidth: 1,
    borderColor: NEON_CYAN,
    padding: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: NEON_GREEN,
    letterSpacing: 3,
  },

  // Zone de recherche
  searchBoxWrapper: {
    flexDirection: "row",
    height: 55,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffffff1a",
    backgroundColor: "#00000033",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "white",
    height: "100%",
  },
  searchBtnGradient: {
    width: 60,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000d9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: NEON_CYAN,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    color: "white",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
  settingText: {
    fontSize: 17,
    color: "white",
    fontWeight: "600",
  },
  settingSubtext: {
    fontSize: 13,
    color: "#94a3b8",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  modalDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ffffff1a",
    marginVertical: 20,
  },
  logoutBtn: {
    backgroundColor: "#e53e3e26",
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e53e3e4d",
  },
  logoutText: {
    color: "#ff5c5c",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeModalBtn: {
    padding: 10,
  },
  closeText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  },
});
