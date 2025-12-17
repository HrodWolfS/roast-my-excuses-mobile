import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getFeed } from "../redux/slices/feedSlice";
import api from "../services/api";

export default function FeedScreen() {
  const dispatch = useDispatch();
  const { items, feedLoading } = useSelector((state) => state.feed);
  const currentUser = useSelector((state) => state.auth.user);
  const [feed, setFeed] = useState([]);
  const [activeTab, setActiveTab] = useState("global");

  const sortByUpvotes = (arr) =>
    [...arr].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  useEffect(() => {
    dispatch(getFeed(activeTab));
  }, [dispatch, activeTab]);

  useEffect(() => {
    setFeed(sortByUpvotes(items || []));
  }, [items]);

  const onRefresh = () => dispatch(getFeed(activeTab));

  const toggleLike = async (id) => {
    try {
      const res = await api.post(`/feed/${id}/like`);
      const updated = res.data;
      setFeed((prev) =>
        sortByUpvotes(
          prev.map((it) => (it.id === id ? { ...it, ...updated } : it))
        )
      );
    } catch (err) {
      console.log("Erreur like", err.response?.data || err.message);
    }
  };

  const renderItem = ({ item }) => {
    const taskLabel = item.task || item.description;
    const rawUser = item.user;
    const displayUser = rawUser
      ? `@${String(rawUser).replace(/^@?/, "")}`
      : "@anonyme";
    const isMe =
      rawUser &&
      currentUser?.userName &&
      String(rawUser).replace(/^@?/, "").toLowerCase() ===
        String(currentUser.userName).replace(/^@?/, "").toLowerCase();

    return (
      <LinearGradient
        colors={["#c9ff53", "#22d3ee"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradientBorder}
      >
        <View style={styles.cardContent}>
          <View style={styles.userRow}>
            <Text style={[styles.userName, isMe && styles.userNameMe]}>
              {displayUser}
            </Text>
            <Pressable
              style={styles.likeRow}
              onPress={() => toggleLike(item.id)}
            >
              <FontAwesome5
                name="pepper-hot"
                size={22}
                color={item.isLiked ? "#f71e1e" : "#fff"}
                solid
              />
              <Text style={styles.likeText}>{item.upvotes}</Text>
            </Pressable>
          </View>
          <View style={styles.roastBox}>
            {taskLabel ? (
              <Text style={styles.taskText}>Tâche : {taskLabel}</Text>
            ) : null}
            <Text style={styles.roastText}>Roast : {item.roast}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const dataToRender = feed;

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.logoWrap}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "global" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("global")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "global" && styles.tabTextActive,
              ]}
            >
              Monde
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "friends" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("friends")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "friends" && styles.tabTextActive,
              ]}
            >
              Amis
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={dataToRender}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            feed.length === 0 ? styles.listEmpty : styles.list
          }
          refreshing={feedLoading}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {activeTab === "friends"
                  ? "Aucun roast d'amis"
                  : "Rien à afficher"}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === "friends"
                  ? "Ajoute des amis flemmards pour les voir ici."
                  : "Ajoute des roasts pour les voir ici !"}
              </Text>
            </View>
          }
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 16, paddingTop: 50 },
  logoWrap: { alignItems: "center", marginBottom: 10 },
  logo: { width: 160, height: 60 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(13, 18, 31, 0.6)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#c9ff53",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#c9ff53",
  },
  tabText: {
    color: "#9fb6c9",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#0f172a",
    fontWeight: "bold",
  },
  list: { paddingBottom: 30 },
  listEmpty: { flexGrow: 1, justifyContent: "center" },
  cardGradientBorder: {
    borderRadius: 20,
    padding: 1.5,
    marginBottom: 15,
    shadowColor: "#c9ff53",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    backgroundColor: "rgba(15, 23, 42, 0.95)", // DARK_CARD equivalent
    borderRadius: 19,
    padding: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userName: { color: "#CFFFE0", fontSize: 14, fontWeight: "800" },
  userNameMe: {
    color: "#22d3ee",
    fontSize: 15,
    fontWeight: "900",
    textShadowColor: "rgba(34, 211, 238, 0.5)",
    textShadowRadius: 8,
  },
  roastBox: {
    backgroundColor: "rgba(108,255,156,0.1)",
    borderRadius: 14,
    padding: 12,
  },
  taskText: { color: "#9aa0a6", fontSize: 12, marginBottom: 4 },
  roastText: {
    color: "#CFFFE0",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  likeText: { color: "#fff", fontWeight: "700" },
  empty: {
    marginTop: 18,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "flex-start",
  },
  emptyTitle: {
    color: "white",
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "left",
  },
  emptyText: { color: "rgba(255,255,255,0.85)", textAlign: "left" },
});
