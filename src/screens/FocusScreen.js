import { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CircularTimer from "../components/CircularTimer";

// Palette Neon
const COLORS = {
  background: "#040C1E",
  text: "#FFFFFF",
  danger: "#FF5252",
  success: "#4AEF8C",
  secondary: "#94a3b8",
  card: "#0D121F",
};

export default function FocusScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentTask } = useSelector((state) => state.tasks);

  // Durée dynamique depuis l'IA (en minutes -> secondes) ou 25 min par défaut
  const [isPlaying, setIsPlaying] = useState(true);
  const duration = (currentTask?.timerDuration || 25) * 60;

  const handleTimerComplete = () => {
    // TODO: Dispatch action to mark task as 'done'
    Alert.alert(
      "🔥 Session terminée !",
      "Tu as survécu à ta procrastination.",
      [
        {
          text: "Voir le résultat",
          onPress: () => navigation.navigate("Main"), // Retour au feed/liste
        },
      ]
    );
  };

  const handleGiveUp = () => {
    Alert.alert("Abandonner ?", "Tu vas vraiment laisser gagner la flemme ?", [
      { text: "Non, je continue", style: "cancel" },
      {
        text: "Oui, je suis faible",
        style: "destructive",
        onPress: () => {
          // TODO: Dispatch action to mark task as 'abandoned' if needed
          navigation.navigate("Main");
        },
      },
    ]);
  };

  const handleSpaceOut = () => {
    setIsPlaying(!isPlaying);
  };

  // Fallback si pas de tâche (accès direct)
  if (!currentTask) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.text}>Aucune tâche en cours.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Text style={{ color: COLORS.success, marginTop: 20 }}>
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🛡️</Text>
          <Text style={styles.headerTitle}>SHUT UP & WORK</Text>
          <Text style={styles.subHeader}>
            Ta mission :{" "}
            <Text style={styles.missionText}>{currentTask.description}</Text>
          </Text>
        </View>

        {/* TIMER CENTRAL */}
        <View style={styles.timerContainer}>
          <CircularTimer
            duration={duration}
            onComplete={handleTimerComplete}
            isPlaying={isPlaying}
          />
        </View>

        {/* FOOTER ACTIONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.pauseButton} onPress={handleSpaceOut}>
            <Text style={styles.pauseButtonText}>
              {isPlaying ? "Pause" : "Reprendre"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGiveUp} style={styles.giveUpButton}>
            <Text style={styles.giveUpText}>J'abandonne (Honteux)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.success,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subHeader: {
    color: COLORS.secondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  missionText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  pauseButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pauseButtonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  giveUpButton: {
    padding: 10,
  },
  giveUpText: {
    color: COLORS.danger,
    textDecorationLine: "underline",
    fontSize: 14,
    opacity: 0.8,
  },
});
