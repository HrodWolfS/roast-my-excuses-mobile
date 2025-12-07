import { StyleSheet, Text, View } from "react-native";

export default function MyTasksScreen() {
  return (
    <View style={styles.container}>
      <Text>Screen: MyTasksScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
