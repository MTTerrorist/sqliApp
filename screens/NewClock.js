import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity
} from "react-native";
import FeatherIcon from "../components/FeatherIcon/FeatherIcon";
import colors from "../colors";
import Database from "../Database";
import HourPicker from "../modules/TimePickers/TimePicker";

const NewClock = ({ navigation }) => {
  const refreshClocks = navigation.state.params.refreshClocks;
  const [selectMode, setSelectMode] = useState("hour");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const backPressHandler = async () => {
    await refreshClocks();
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backPressHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backPressHandler);
    };
  }, []);

  const addClock = async () => {
    try {
      await Database.addClock(hour, minute);
      await refreshClocks();
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <TouchableOpacity onPress={() => setSelectMode("hour")}>
          <Text
            style={{
              ...styles.selectedTimeText,
              color:
                selectMode === "hour"
                  ? colors.accentColor
                  : colors.textPrimaryColor
            }}
          >
            {String(hour).padStart(2, "0")}
          </Text>
        </TouchableOpacity>
        <Text style={styles.selectedTimeText}>:</Text>
        <TouchableOpacity onPress={() => setSelectMode("minute")}>
          <Text
            style={{
              ...styles.selectedTimeText,
              color:
                selectMode === "minute"
                  ? colors.accentColor
                  : colors.textPrimaryColor
            }}
          >
            {String(minute).padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      </View>
      <HourPicker
        mode={selectMode}
        setHour={setHour}
        setMinute={setMinute}
        setSelectMode={setSelectMode}
      />

      <View style={styles.iconContainer}>
        <FeatherIcon iconName="plus" size="big" onPress={addClock} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: colors.defaultPrimaryColor
  },
  timeContainer: {
    position: "absolute",
    top: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  selectedTimeText: {
    fontSize: 50
  },
  iconContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default NewClock;
