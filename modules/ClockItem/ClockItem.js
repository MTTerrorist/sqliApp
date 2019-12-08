import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Animated,
  TouchableNativeFeedback
} from "react-native";
import FeatherIcon from "../../components/FeatherIcon/FeatherIcon";
import colors from "../../colors";
import Database, { days } from "../../Database";

const ClockItem = ({
  id,
  hour,
  minute,
  isActive,
  daysActive,
  onActiveStateToggle,
  onRemoveClock,
  refreshClocks
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const [height] = useState(new Animated.Value(80));
  const [toValue, setToValue] = useState(160);

  const onToggle = () => {
    Animated.timing(height, {
      toValue,
      duration: 200
    }).start();

    setToValue(isExpanded ? 160 : 80);
    setExpanded(currentState => !currentState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstRowContainer}>
        <Text style={styles.timeText}>
          {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
        </Text>
        <Switch
          value={isActive}
          onValueChange={onActiveStateToggle}
          style={{ transform: [{ scale: 1.5 }] }}
        />
      </View>
      <Animated.View style={{ ...styles.secondRowContainer, height: height }}>
        <View style={styles.iconsContainer}>
          <FeatherIcon size="small" onPress={onRemoveClock} iconName="trash" />
          <Text style={styles.collapsedDaysText}>
            {!isExpanded &&
              daysActive.map(
                (day, index, daysArr) =>
                  `${day}${index !== daysArr.length - 1 ? "," : ""} `
              )}
          </Text>
          <FeatherIcon
            size="small"
            onPress={onToggle}
            iconName={isExpanded ? "arrow-up-circle" : "arrow-down-circle"}
          />
        </View>
        <View style={{ ...styles.daysContainer, opacity: isExpanded ? 1 : 0 }}>
          {days.map((day, index) => (
            <TouchableNativeFeedback
              key={index}
              background={TouchableNativeFeedback.Ripple(
                "rgba(255,255,255,1)",
                true
              )}
              useForeground={true}
              onPress={async () => {
                await Database.toggleDay(day, id);
                refreshClocks();
              }}
              style={styles.nativeFeedback}
            >
              <View
                style={{
                  ...styles.dayView,
                  backgroundColor: daysActive.includes(day)
                    ? colors.accentColor
                    : colors.darkPrimaryColor
                }}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 15
  },
  firstRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10
  },
  timeText: {
    fontSize: 60,
    color: colors.textPrimaryColor
  },
  secondRowContainer: {
    flex: 1,
    height: 400,
    borderBottomWidth: 2,
    borderBottomColor: colors.dividerColor
  },
  iconsContainer: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15
  },
  collapsedDaysText: {
    color: colors.textPrimaryColor,
    fontWeight: "bold"
  },

  daysContainer: {
    height: 80,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  nativeFeedback: {
    padding: 5,
    margin: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  dayView: {
    flex: 1,
    margin: 3,
    padding: 5,
    borderRadius: 6969
  },
  dayText: {
    textAlign: "center",
    color: colors.textPrimaryColor
  }
});

export default ClockItem;
