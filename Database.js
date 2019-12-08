import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("holuj_wojtek_4ic1.sql");
export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class Database {
  static sqlQuery(query) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (_, resultSet) => resolve(JSON.parse(JSON.stringify(resultSet))),
          (_, error) => reject(error)
        );
      });
    });
  }

  static async createTable() {
    await Database.sqlQuery(
      "CREATE TABLE IF NOT EXISTS clocks (id INTEGER PRIMARY KEY NOT NULL, hour INT, minute INT, isActive INT, daysActive TEXT);"
    );
  }

  static async addClock(hour, minute) {
    const today = days[new Date().getDay()];
    await Database.sqlQuery(
      `INSERT INTO clocks (hour, minute, isActive, daysActive) VALUES (${hour}, ${minute}, 0, '${today}');`
    );
  }

  static async changeActiveState(newActiveState, id) {
    await Database.sqlQuery(
      `UPDATE clocks SET isActive = ${newActiveState ? 1 : 0} WHERE id = ${id};`
    );
  }

  static async toggleDay(dayToToggle, id) {
    const xxdddxxxdd = "Sun,Thu";

    const clockQuery = await Database.sqlQuery(
      `SELECT * FROM clocks WHERE id = '${id}';`
    );
    const { daysActive } = clockQuery.rows._array[0];

    const currentDaysSelectedArr = daysActive.split(",");
    let newDaysSelectedArr;

    if (currentDaysSelectedArr.includes(dayToToggle)) {
      newDaysSelectedArr = currentDaysSelectedArr.filter(
        currentDay => currentDay !== dayToToggle
      );
    } else {
      newDaysSelectedArr = [...currentDaysSelectedArr, dayToToggle];
    }

    const updatedDays = newDaysSelectedArr
      .filter(value => value !== "")
      .sort((a, b) => days.indexOf(a) - days.indexOf(b))
      .join(",");

    await Database.sqlQuery(
      `UPDATE clocks SET daysActive = '${updatedDays}' WHERE id = ${id};`
    );
  }

  static async getAll() {
    try {
      const dbItems = await Database.sqlQuery("SELECT * FROM clocks");

      const { _array: clocks } = dbItems.rows;

      return clocks.map(({ daysActive, isActive, ...restParams }) => ({
        ...restParams,
        daysActive: daysActive.split(","),
        isActive: Boolean(isActive)
      }));
    } catch (e) {
      return e;
    }
  }

  static async remove(id) {
    await Database.sqlQuery(`DELETE FROM clocks WHERE id = ${id};`);
  }

  static async removeAll() {
    await Database.sqlQuery("DELETE FROM clocks;");
  }

  static async dropTable() {
    await Database.sqlQuery("DROP TABLE IF EXISTS clocks;");
  }
}

export default Database;
