import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  EmptyState,
  FilterTab,
  StatusBadge,
} from "../components/TaskComponents";
import { getMyTasks } from "../redux/slices/taskSlices";

export default function TasksScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [activeFilter, setActiveFilter] = useState("pending"); // 'pending', 'in_progress', 'completed'

  // Chargement initial
  useEffect(() => {
    dispatch(getMyTasks());
  }, []);

  // Filtrage optimisé
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeFilter === "pending") return task.status === "pending";
      if (activeFilter === "in_progress") return task.status === "in_progress";
      if (activeFilter === "completed") return task.status === "completed";
      return true;
    });
  }, [tasks, activeFilter]);

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RoastResult", { taskId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {item.description}
        </Text>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.taskExcuse} numberOfLines={2}>
        💭 "{item.excuse}"
      </Text>
      {item.pointsEarned > 0 && (
        <Text style={styles.points}>+{item.pointsEarned} pts</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Mes Tâches</Text>

          {/* --- FILTER TABS --- */}
          <View style={styles.tabsContainer}>
            <FilterTab
              title="À faire"
              value="pending"
              active={activeFilter}
              onPress={setActiveFilter}
            />
            <FilterTab
              title="En cours"
              value="in_progress"
              active={activeFilter}
              onPress={setActiveFilter}
            />
            <FilterTab
              title="Terminé"
              value="completed"
              active={activeFilter}
              onPress={setActiveFilter}
            />
          </View>

          {/* --- LIST --- */}
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => dispatch(getMyTasks())}
                tintColor="#FFFFFF" // Spinner blanc pour le fond sombre
              />
            }
            ListEmptyComponent={
              <EmptyState filter={activeFilter} navigation={navigation} />
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4, 12, 30, 0.85)", // Calque sombre pour lisibilité
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginLeft: 20,
    marginBottom: 20,
    color: "#FFFFFF", // Texte blanc
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  // Card styling adapted for dark bg
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Glass effect
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
  },
  taskExcuse: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  points: {
    marginTop: 8,
    alignSelf: "flex-start",
    color: "#4AEF8C", // Neon green
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "rgba(74, 239, 140, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
});
