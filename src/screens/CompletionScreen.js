import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CompletionScreen() {
  return (
    <View style={styles.container}>
      <Text>Screen: CompletionScreen</Text>
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
