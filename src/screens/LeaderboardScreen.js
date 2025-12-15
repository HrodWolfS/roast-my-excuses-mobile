import React, { useEffect, useRef, useState } from "react";
import { 
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";

const ROW_HEIGHT = 64;

const MOCK_GLOBAL = Array.from({ length: 250 }).map((_, i) => ({
  userId: i === 120 ? "me" : `u_${i}`,
  rank: i + 1,
  username: i === 120 ? "MonPseudo" : `Flemmard_${i + 1}`,
  points: Math.max(0, 2000 - i * 10),
  leagueIcon: i % 7 === 0 ? "https://picsum.photos/seed/league/40" : null,
}));

const MOCK_FRIENDS = [];

function TabButton({ label, active, onPress}) {
  return (
    <Pressable
    onPress={onPress}
    style={[
      styles.tabButton,
      active ? styles.tabButtonActive : null,
    ]}
    >
      <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function LeaderboardRow({ item, isMe }) {
  const isTopThree = item.rank <= 3;
  const badgeStyle =
    item.rank === 1
      ? styles.rankBadgeGold
      : item.rank === 2
      ? styles.rankBadgeSilver
      : item.rank === 3
      ? styles.rankBadgeBronze
      : null;

  return (
    <View style={[styles.row, isMe ? styles.rowMe : null]}>
      {isTopThree ? (
        <View style={[styles.rankBadge, badgeStyle]}>
          <Text style={[styles.rankText, styles.rankTextTop]}>
            {item.rank}.
          </Text>
        </View>
      ) : (
        <Text style={styles.rankText}>{item.rank}.</Text>
      )}

      <View style={styles.userBlock}>
        <Text style={[styles.username, isMe ? styles.usernameMe : null]}>
          {item.username}
        </Text>
      </View>

      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );
}

export default function LeaderboardScreen() {

    const currentUserId = "me";

    const [activeTab, setActiveTab] = useState("global");
    const [globalData, setGlobalData] = useState([]);
    const [friendsData, setFriendsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const listRef = useRef(null);

    useEffect(() => {
      async function load() {
        setLoading(true);

        await new Promise((r) => setTimeout(r, 400));

        setGlobalData(MOCK_GLOBAL.slice(0, 25));
        setFriendsData(MOCK_FRIENDS.slice(0, 25));

        setLoading(false);
      }

      load();
    }, []);

    const data = activeTab === "global" ? globalData : friendsData;

    useEffect(() => {
      if (loading) return;
      if (!data || data.length === 0) return;

      const myIndex = data.findIndex((u) => u.userId === currentUserId);
      if (myIndex < 0) return;

      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: myIndex,
          animated: true,
          viewPosition: 0.3,
        });
      });
    }, [loading, activeTab, globalData, friendsData]);

    const onRefresh = async () => {
      setRefreshing(true);

      await new Promise((r) => setTimeout(r, 500));

      if (activeTab === "global") setGlobalData(MOCK_GLOBAL.slice(0, 25));
      else setFriendsData(MOCK_FRIENDS.slice(0, 25));

      setRefreshing(false);
    };

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
          style= {styles.fixedBackground}
          resizeMode="cover"/>

          <View style={styles.loadingOverlay}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Chargement du classement...</Text>
          </View>
        </View>
      );
    }

  return (
<View style={styles.screen}>

    <ImageBackground
          source={require("../assets/background.jpg")}
          style= {styles.fixedBackground}
          resizeMode="cover"/>

    <View style={styles.content}>
      <Text style={styles.title}>Classement</Text>

      <View style={styles.tabs}>
        <TabButton
        label="Monde"
        active={activeTab === "global"}
        onPress={() => setActiveTab("global")} />

        <TabButton
        label="Amis"
        active={activeTab === "friends"}
        onPress={() => setActiveTab("friends")} />
      </View>

      <FlatList
      ref={listRef}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={data}
      keyExtractor={(item) => item.userId}
      renderItem={({ item }) => (
        <LeaderboardRow
        item={item}
        isMe={item.userId === currentUserId} />
      )}
      getItemLayout={getItemLayout}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucun classement</Text>
          <Text style={styles.emptyText}>
            {activeTab === "friends"
            ? "Ajoute des amis flemmards pour voir les voir ici."
            : "Le classement est vide pour le moment."}
          </Text>
        </View>
      }
      ListHeaderComponent={
        activeTab === "global" ? (
          <View style={styles.leagueHeader}>
            <Image
              source={require("../assets/ligProCrastinateur.png")}
              style={styles.leagueHeaderImage}
            />
          </View>
        ) : null
      }
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }, 50);
        }}
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
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  tabText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "white",
    fontWeight: "800",
  },

  list: { flex: 1 },
  listContent: {
    paddingBottom: 24,
  },
  leagueHeader: {
    height: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  leagueHeaderImage: {
    marginTop: 11,
    width: "100%",
    height: 770,
    borderRadius: 12,
  },

  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  rowMe: {
    backgroundColor: "rgba(255,59,48,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,59,48,0.9)",
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 0,
  },
  rankBadgeGold: { backgroundColor: "rgba(245,210,97,0.5)" },
  rankBadgeSilver: { backgroundColor: "rgba(224,229,236,0.5)" },
  rankBadgeBronze: { backgroundColor: "rgba(224,176,138,0.5)" },
  rankText: { color: "white", fontWeight: "800", fontSize: 16, marginRight: 10 },
  rankTextTop: { color: "#1f2937", marginRight: 0 },
  userBlock: { flex: 1 },
  username: { color: "white", fontWeight: "700" },
  usernameMe: { fontWeight: "900" },
  points: {
    width: 110,
    color: "white",
    textAlign: "right",
    fontWeight: "800",
  },

  empty: {
    marginTop: 18,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  emptyTitle: { color: "white", fontWeight: "800", marginBottom: 6 },
  emptyText: { color: "rgba(255,255,255,0.85)" },

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
