import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('krzyzak_daniel_4ic1.sql');

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export const days: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class Database {
	static createTableQuery =
		'CREATE TABLE IF NOT EXISTS clocks (id INTEGER PRIMARY KEY NOT NULL, hour INT, minute INT, isActive INT, daysActive TEXT);';

	static sqlQuery(query: string) {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				tx.executeSql(
					query,
					[],
					(_, resultSet) => resolve(JSON.parse(JSON.stringify(resultSet))),
					(_, error) => (reject(error) as unknown) as boolean
				);
			});
		});
	}

	static async createTable() {
		await Database.sqlQuery(Database.createTableQuery);
	}

	static async addClock(hour: number, minute: number) {
		const today = days[new Date().getDay()];
		await Database.sqlQuery(`INSERT INTO clocks (hour, minute, isActive, daysActive) VALUES (${hour}, ${minute}, 0, '${today}');`);
	}

	static async changeActiveState(newActiveState: boolean, id: number) {
		await Database.sqlQuery(`UPDATE clocks SET isActive = ${newActiveState ? 1 : 0} WHERE id = ${id};`);
	}

	static async toggleDay(dayToToggle: Day, id: number) {
		const clockQuery: any = await Database.sqlQuery(`SELECT * FROM clocks WHERE id = '${id}';`);
		const { daysActive } = clockQuery.rows._array[0];

		const currentDaysSelectedArr: Day[] = daysActive.split(',');
		let newDaysSelectedArr: Day[];

		if (currentDaysSelectedArr.includes(dayToToggle)) {
			newDaysSelectedArr = currentDaysSelectedArr.filter(currentDay => currentDay !== dayToToggle);
		} else {
			newDaysSelectedArr = [...currentDaysSelectedArr, dayToToggle];
		}

		const updatedDays = newDaysSelectedArr
			.filter(Boolean)
			.sort((a, b) => days.indexOf(a) - days.indexOf(b))
			.join(',');

		await Database.sqlQuery(`UPDATE clocks SET daysActive = '${updatedDays}' WHERE id = ${id};`);
	}

	static async getAll() {
		const query = 'SELECT * FROM clocks';
		try {
			const dbItems: any = await Database.sqlQuery(query);

			const { _array: clocks } = dbItems.rows;

			return clocks.map(({ daysActive, isActive, ...restParams }) => {
				const daysActiveArr = daysActive.split(',');

				return { ...restParams, daysActive: daysActiveArr, isActive: !!isActive };
			});
		} catch (e) {
			return e;
		}
	}

	static async remove(id: number) {
		await Database.sqlQuery(`DELETE FROM clocks WHERE id = ${id};`);
	}

	static async removeAll() {
		await Database.sqlQuery('DELETE FROM clocks;');
	}

	static async dropTable() {
		await Database.sqlQuery('DROP TABLE IF EXISTS clocks;');
	}
}

export default Database;
