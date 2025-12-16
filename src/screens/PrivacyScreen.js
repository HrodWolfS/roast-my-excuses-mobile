import { PRIVACY_TEXT } from "../constants/legalText";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { TERMS_TEXT } from "../constants/legalText";

const COLORS = {
  primary: "#4AEF8C",
  text: "#FFFFFF",
  card: "rgba(13, 18, 31, 0.85)", // Fond texte bien lisible
};

export default function TermsScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{PRIVACY_TEXT}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1 }, // Pas de couleur de fond ici, on laisse voir l'image
  content: { padding: 20, paddingTop: 100 },
  textContainer: {
    backgroundColor: COLORS.card, // Le bloc de texte a son propre fond sombre
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(74, 239, 140, 0.2)", // Légère bordure verte néon
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
});
