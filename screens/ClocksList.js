import React, { useState, useEffect } from "react";
import { View, StyleSheet, Vibration } from "react-native";
import { FlatList } from "react-navigation";
import colors from "../colors";
import ClockItem from "../modules/ClockItem";
import FeatherIcon from "../components/FeatherIcon/FeatherIcon";
import Database, { days } from "../Database";

const ClocksList = ({ navigation }) => {
  const [clockItems, setClockItems] = useState([]);

  useEffect(() => {
    const checkTimeInterval = setInterval(async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = days[now.getDay()];

      clockItems.forEach(async ({ hour, minute, isActive, daysActive }) => {
        if (!isActive) return;

        if (
          daysActive.includes(currentDay) &&
          hour === currentHour &&
          currentMinute >= minute &&
          currentMinute < minute + 5
        ) {
          Vibration.vibrate([100, 200, 300]);
        }
      });
    }, 1000);

    return async () => {
      clearInterval(checkTimeInterval);
    };
  }, [clockItems]);

  const refreshClocks = async () => {
    const dbItems = await Database.getAll();
    setClockItems(dbItems);
  };

  useEffect(() => {
    refreshClocks();
  }, []);

  const removeClock = async id => {
    await Database.remove(id);
    refreshClocks();
  };

  const changeActiveState = async (newActiveState, id) => {
    await Database.changeActiveState(newActiveState, id);
    refreshClocks();
  };

  return (
    <View style={styles.container}>
      <View style={styles.clockListView}>
        <FlatList
          data={clockItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ClockItem
              key={item.id}
              id={item.id}
              {...item}
              onActiveStateToggle={() =>
                changeActiveState(!item.isActive, item.id)
              }
              onRemoveClock={() => removeClock(item.id)}
              refreshClocks={refreshClocks}
            />
          )}
        />
      </View>
      <View style={styles.iconContainer}>
        <FeatherIcon
          haveBackground
          iconName="plus"
          size="big"
          onPress={() => navigation.navigate("newClock", { refreshClocks })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultPrimaryColor
  },
  clockListView: { flex: 11 },
  iconContainer: {
    flex: 2,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  }
});

export default ClocksList;
