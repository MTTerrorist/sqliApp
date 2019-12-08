import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Button from "../components/Button";
import colors from "../colors";
import Database from "../Database";

const FrontPage = ({ navigation }) => {
  useEffect(() => {
    Database.createTable();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headlineTextBig}>SQLite App</Text>
      <Text key={index} style={styles.headlineTextSm}>
        manage sqlite
      </Text>
      <Text key={index} style={styles.headlineTextSm}>
        use animation
      </Text>
      <Text key={index} style={styles.headlineTextSm}>
        use ring
      </Text>
      <View style={styles.startBtnContainer}>
        <Button onPress={() => navigation.navigate("clocksList")}>Start</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultPrimaryColor,
    justifyContent: "center",
    alignItems: "center"
  },
  headlineTextBig: {
    color: colors.textPrimaryColor,
    fontSize: 50,
    marginBottom: 10
  },
  headlineTextSm: {
    color: colors.primaryTextColor,
    fontSize: 20,
    marginBottom: 15
  },
  startBtnContainer: {
    height: 75,
    width: Dimensions.get("window").width * 0.4
  }
});

export default FrontPage;
