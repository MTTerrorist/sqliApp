import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../colors";

const FeatherIcon = ({ onPress, size, iconName, haveBackground = false }) => {
  const { nativeFeedback, iconContainer } = styles(
    size === "big",
    haveBackground
  );

  return (
    <TouchableNativeFeedback
      useForeground
      background={TouchableNativeFeedback.Ripple("rgba(255,255,255,1)", true)}
      onPress={onPress}
      style={nativeFeedback}
    >
      <View style={iconContainer}>
        <Feather
          name={iconName}
          color={colors.textPrimaryColor}
          size={size === "big" ? 45 : 25}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = (isBig, haveBackground) =>
  StyleSheet.create({
    nativeFeedback: {
      padding: 10,
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
      width: isBig ? 120 : 60,
      height: isBig ? 120 : 60,
      borderColor: colors.secondaryTextColor
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: isBig ? 80 : 40,
      height: isBig ? 80 : 40,
      backgroundColor: haveBackground
        ? colors.accentColor
        : colors.darkPrimaryColor,
      borderRadius: 666,
      padding: 5
    }
  });

export default FeatherIcon;
