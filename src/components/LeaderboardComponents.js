import { Pressable, StyleSheet, Text, View } from "react-native";

export const ROW_HEIGHT = 64;

export function TabButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active ? styles.tabButtonActive : null]}
    >
      <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function LeaderboardRow({ item, isMe }) {
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

const styles = StyleSheet.create({
  // --- TABS STYLES ---
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

  // --- ROW STYLES ---
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

  rankText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 10,
  },
  rankTextTop: {
    color: "#1f2937",
    marginRight: 0,
  },
  userBlock: {
    flex: 1,
  },
  username: {
    color: "white",
    fontWeight: "700",
  },
  usernameMe: {
    fontWeight: "900",
  },
  points: {
    width: 110,
    color: "white",
    textAlign: "right",
    fontWeight: "800",
  },
});
