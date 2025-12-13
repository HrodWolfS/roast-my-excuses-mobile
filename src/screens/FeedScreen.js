import { ImageBackground, StyleSheet, Text, View } from "react-native";
import CircularTimer from "../components/CircularTimer";

export default function FeedScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.text}>FeedScreen</Text>
        <CircularTimer duration={20} onComplete={() => console.log("Done")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
