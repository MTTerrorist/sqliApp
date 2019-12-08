import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../colors";

const RoundedButton = ({ onPress, size, iconName }) => {
  const { opacity, container } = styles(size === "big");

  return (
    <TouchableOpacity onPress={onPress} style={opacity}>
      <View style={container}>
        <AntDesign
          name={iconName}
          color={colors.defaultPrimaryColor}
          size={size === "big" ? 45 : 25}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = isBig =>
  StyleSheet.create({
    opacity: {
      backgroundColor: colors.textPrimaryColor,
      padding: 10,
      margin: 5,
      alignItems: "center",
      borderRadius: 666,
      width: isBig ? 100 : 60,
      height: isBig ? 100 : 60,
      borderWidth: 2,
      borderColor: colors.secondaryTextColor
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  });

export default RoundedButton;
