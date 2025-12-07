import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CreateFlowScreen() {
  return (
    <View style={styles.container}>
      <Text>Screen: CreateFlowScreen</Text>
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
