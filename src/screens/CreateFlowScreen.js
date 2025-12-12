import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../redux/slices/taskSlices";

// Design System Colors
const COLORS = {
  background: "#040C1E",
  card: "#0D121F",
  primary: "#4AEF8C", // Neon Green
  secondary: "#40FAEF", // Neon Cyan
  text: "#FFFFFF",
  textSecondary: "#A6A6A6",
  danger: "#FF5252",
};

export default function CreateFlowScreen({ navigation }) {
  // 1. État Local
  const [task, setTask] = useState("");
  const [excuse, setExcuse] = useState("");
  const [mode, setMode] = useState("challenge"); // 'challenge' | 'roasty'
  const [errors, setErrors] = useState({ task: null, excuse: null });

  // Redux hooks et on récupère 'loading' pour gérer l'UI et 'error' pour afficher les soucis API
  const dispatch = useDispatch();
  const { loading, error: apiError } = useSelector((state) => state.tasks);

  // 2. Configuration du Header (Croix de fermeture)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 3. Logique de Validation
  const validate = () => {
    let isValid = true;
    let newErrors = { task: null, excuse: null };

    if (task.trim().length < 10) {
      newErrors.task = "La tâche doit faire au moins 10 caractères.";
      isValid = false;
    }

    if (excuse.trim().length < 5) {
      newErrors.excuse = "L'excuse doit faire au moins 5 caractères.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 4. Handler de Soumission modififé pour Redux
  const handleSubmit = async () => {
    // Préparation des données pour le Backend
    // Le backend attend { description, excuse, type }
    // On lance la validation. Si c'est faux (false), on arrête tout (return).
    if (!validate()) return;
    // -----------------------
    const taskData = {
      description: task, // Ton state local s'appelle 'task', le back veut 'description'
      excuse: excuse,
      type: mode,
    };

    try {
      // On lance l'action et on attend le résultat
      // .unwrap() permet de gérer la promesse (success/error) facilement
      await dispatch(createTask(taskData)).unwrap();

      // 4. Navigation (seulement si pas d'erreur)
      if (mode === "roasty") {
        // On passe les infos, mais le RoastResult ira lire le store Redux de toute façon
        navigation.navigate("RoastModal");
      } else {
        // Mode Challenge : retour au feed (le feed devra se rafraîchir)
        navigation.goBack();
      }

      // Optionnel : Reset du formulaire ici si besoin
      setTask("");
      setExcuse("");
    } catch (err) {
      // Si l'API renvoie une erreur (gérée par le rejectWithValue dans le slice)
      console.error("Erreur création task:", err);
      // Tu peux afficher une alerte ou laisser l'affichage de l'erreur via l'UI
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nouvelle Excuse</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View style={styles.formContainer}>
              {/* INPUT TÂCHE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quelle tâche tu évites ?</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={3}
                  style={[styles.input, errors.task && styles.inputError]}
                  placeholder="Ex: Finir le rapport trimestriel..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={task}
                  onChangeText={(t) => {
                    setTask(t);
                    if (errors.task) setErrors({ ...errors, task: null });
                  }}
                  maxLength={100}
                />
                {errors.task && (
                  <Text style={styles.errorText}>{errors.task}</Text>
                )}
              </View>

              {/* INPUT EXCUSE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pourquoi tu la fais pas ?</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={3}
                  style={[styles.input, errors.excuse && styles.inputError]}
                  placeholder="Ex: J'ai poney aquatique..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={excuse}
                  onChangeText={(t) => {
                    setExcuse(t);
                    if (errors.excuse) setErrors({ ...errors, excuse: null });
                  }}
                  maxLength={200}
                />
                {errors.excuse && (
                  <Text style={styles.errorText}>{errors.excuse}</Text>
                )}
              </View>

              {/* TOGGLE MODE */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    mode === "challenge" && styles.toggleActive,
                  ]}
                  onPress={() => setMode("challenge")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === "challenge" && styles.toggleTextActive,
                    ]}
                  >
                    Challenge
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    mode === "roasty" && styles.toggleActive,
                  ]}
                  onPress={() => setMode("roasty")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === "roasty" && styles.toggleTextActive,
                    ]}
                  >
                    Roasty
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                {mode === "challenge"
                  ? "Reçois un plan d'action et lance un timer."
                  : "Juste un roast brutal pour rire."}
              </Text>
            </View>

            {/* BOUTON VALIDER */}
            <View style={styles.footer}>
              {/* Affichage de l'erreur API si elle existe */}
              {apiError && (
                <Text
                  style={{
                    color: COLORS.danger,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {apiError}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && {
                    opacity: 0.7,
                    backgroundColor: COLORS.textSecondary,
                  }, // Style désactivé
                ]}
                onPress={handleSubmit}
                disabled={loading} // Empêche de cliquer pendant le chargement
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Chargement..." : "Valider"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 50,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  helperText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.card,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
