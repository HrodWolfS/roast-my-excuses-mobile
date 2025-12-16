import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import {
  LeaderboardRow,
  ROW_HEIGHT,
  TabButton,
} from "../components/LeaderboardComponents";
import api from "../services/api";

const FAKE_NAMES = [
  "KingOfNap",
  "ProCrastinator",
  "DemainJure",
  "CanapéMan",
  "NetflixWarrior",
  "PasAujourdhui",
  "ZeroEffort",
  "SlowMo",
  "LaSieste",
  "MisterDodo",
  "LazyCat",
  "ChillBill",
  "NoStress",
  "ZenMaster",
  "SleepyHead",
  "LaterHater",
  "DoItTomorrow",
  "PauseCafé",
  "RienFaire",
  "ModeAvion",
  "BatterieFaible",
  "EcoEnergy",
  "StandbyMode",
  "Lagging",
  "AFK_Champion",
  "SnoozeButton",
  "MorningHater",
  "NightOwl",
  "BedLover",
  "PajamaParty",
  "SoftLife",
  "Tranquille",
  "Pepouze",
  "Doucement",
  "PasVite",
  "CoolRaoul",
  "RelaxMax",
  "FlemmeOlympique",
  "GoldMedalNap",
  "SiesteKing",
  "FatigueChronik",
  "LowPower",
  "DimancheEternel",
  "LundiNon",
  "VendrediOui",
  "WeekendWarrior",
  "HolidayMood",
  "VacancesForever",
  "RetraiteAnticipee",
  "BornToChill",
];

const MOCK_GLOBAL_TEMPLATE = Array.from({ length: 50 }).map((_, i) => ({
  userId: `mock_${i}`,
  rank: i + 1,
  username: FAKE_NAMES[i] || `Flemmard_${i + 1}`,
  points: Math.max(0, 2000 - i * 30),
  leagueIcon: i % 7 === 0 ? "https://picsum.photos/seed/league/40" : null,
}));

const MOCK_FRIENDS = [];

export default function LeaderboardScreen() {
  const { user } = useSelector((state) => state.auth);

  // Robust extraction of user info
  // If user is string (legacy), it's the username. If object, it has _id and userName.
  const currentUsername = typeof user === "string" ? user : user?.userName;
  const currentUserId = typeof user === "object" ? user?._id : null;

  const [activeTab, setActiveTab] = useState("global");
  const [leaderboardData, setLeaderboardData] = useState([]); // Données réelles + mocks
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef(null);

  const fetchLeaderboard = async () => {
    try {
      // 1. Appel API
      const response = await api.get("/users/leaderboard?limit=50");
      console.log("Leaderboard response:", response.data);
      const realUsers = response.data.data;

      // 2. Formatage des données réelles
      const formattedRealUsers = realUsers.map((u, index) => {
        // Safe check for "isMe"
        const isMe = currentUserId
          ? u._id === currentUserId
          : u.userName === currentUsername;

        return {
          userId: u._id,
          rank: index + 1,
          username: u.userName,
          points: u.points,
          leagueIcon: null, // Pas encore d'icône dynamique
          isMe: isMe,
        };
      });

      // 3. Fusion avec les mocks (pour remplir la liste comme demandé)
      // On prend les mocks à partir du rang (nombre de users réels + 1)
      const offset = formattedRealUsers.length;
      const effectiveMocks = MOCK_GLOBAL_TEMPLATE.slice(offset).map((m, i) => ({
        ...m,
        rank: offset + i + 1, // Recalcul du rang pour suivre la suite
      }));

      return [...formattedRealUsers, ...effectiveMocks];
    } catch (error) {
      console.error("Erreur leaderboard:", error);
      return MOCK_GLOBAL_TEMPLATE; // Fallback mocks si erreur
    }
  };

  const loadData = async () => {
    // Si c'est un refresh, on ne met pas loading à true pour ne pas flasher tout l'écran
    // Mais ici c'est le chargement initial
    const data = await fetchLeaderboard();
    setLeaderboardData(data);
    setFriendsData(MOCK_FRIENDS.slice(0, 25)); // Pas encore de friends API
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchLeaderboard();
    setLeaderboardData(data);
    setRefreshing(false);
  };

  const data = activeTab === "global" ? leaderboardData : friendsData;

  // Scroll to me logic (facultatif si on est dans le top 50, on sera visible)
  /*
  useEffect(() => {
    if (loading || !data || data.length === 0) return;
    const myIndex = data.findIndex((u) => u.username === currentUsername); // Using username as ID check
    if (myIndex >= 0) {
       // Scroll logic here if needed
    }
  }, [loading, data, currentUsername]);
  */

  const getItemLayout = (_, index) => ({
    length: ROW_HEIGHT,
    offset: ROW_HEIGHT * index,
    index,
  });

  if (loading) {
    return (
      <View style={styles.screen}>
        <ImageBackground
          source={require("../assets/background.jpg")}
          style={styles.fixedBackground}
          resizeMode="cover"
        />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#BEF264" />
          <Text style={styles.loadingText}>Chargement des flemmards...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.fixedBackground}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Classement</Text>

        <View style={styles.tabs}>
          <TabButton
            label="Monde"
            active={activeTab === "global"}
            onPress={() => setActiveTab("global")}
          />

          <TabButton
            label="Amis"
            active={activeTab === "friends"}
            onPress={() => setActiveTab("friends")}
          />
        </View>

        <FlatList
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={(item) => item.userId.toString()}
          renderItem={({ item }) => (
            <LeaderboardRow
              item={item}
              isMe={item.username === currentUsername} 
            />
          )}
          getItemLayout={getItemLayout}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#BEF264"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Aucun classement</Text>
              <Text style={styles.emptyText}>
                {activeTab === "friends"
                  ? "Ajoute des amis flemmards pour les voir ici."
                  : "Le classement est vide pour le moment."}
              </Text>
            </View>
          }
          ListHeaderComponent={
            activeTab === "global" ? (
              <View style={styles.leagueHeader}>
                <Image
                  source={require("../assets/leagues/ProCrastinateur.png")}
                  style={styles.leagueHeaderImage}
                />
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  fixedBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.41)",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BEF264",
  },
  list: { 
    flex: 1 
  },
  listContent: {
    paddingBottom: 24,
  },
  leagueHeader: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  leagueHeaderImage: {
    width: "100%",
    height: 100,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  empty: {
    marginTop: 18,
    padding: 16,
    borderRadius: 12,
  },
  emptyTitle: { 
    color: "white", 
    fontWeight: "800", 
    marginBottom: 6 
  },
  emptyText: { 
    color: "rgba(255,255,255,0.85)" 
  },
  loadingOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontWeight: "700",
  },
});
