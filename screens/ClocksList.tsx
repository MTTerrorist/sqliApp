import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationInjectedProps, FlatList } from 'react-navigation';
import { Audio } from 'expo-av';
import colors from '../colors';
import ClockItem from '../modules/ClockItem';
import FeatherIcon from '../components/FeatherIcon/FeatherIcon';
import Database, { Day, days } from '../Database';

const soundObject = new Audio.Sound();

export interface ClockData {
	id: number;
	hour: number;
	minute: number;
	isActive: boolean;
	daysActive: Day[];
}

const devMode = false;

const ClocksList: React.FC<NavigationInjectedProps> = ({ navigation }) => {
	const [clockItems, setClockItems] = useState<ClockData[]>([]);
	const [isAudioLoaded, setAudioLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (devMode) return;

		if (soundObject._loaded) {
			return setAudioLoaded(true);
		}

		soundObject
			.loadAsync(require('../assets/alarm.mp3'))
			.then(val => {
				setAudioLoaded(true);
			})
			.catch(err => console.error(err));
	}, []);

	useEffect(() => {
		if (devMode) return;
		if (!isAudioLoaded) return;

		const checkTimeInterval = setInterval(async () => {
			// check if it isn't already been playing
			const status = await soundObject.getStatusAsync();
			const { isPlaying } = status as any;

			const now = new Date();
			const currentHour = now.getHours();
			const currentMinute = now.getMinutes();
			const currentDay = days[now.getDay()];

			clockItems.forEach(async ({ hour, minute, isActive, daysActive }) => {
				if (!isActive) return;

				if (
					daysActive.includes(currentDay) &&
					hour === currentHour &&
					(devMode || (currentMinute >= minute && currentMinute < minute + 5))
				) {
					if (isPlaying) {
						return;
					}

					await soundObject.setIsLoopingAsync(true);
					await soundObject.playFromPositionAsync(0);
				} else {
					if (isPlaying) {
						await soundObject.stopAsync();
					}
				}
			});
		}, 1000);

		return async () => {
			clearInterval(checkTimeInterval);
			if (!isAudioLoaded) return;

			await soundObject.stopAsync();
		};
	}, [clockItems, isAudioLoaded]);

	const refreshClocks = async () => {
		const dbItems = await Database.getAll();
		setClockItems((dbItems as unknown) as ClockData[]);
	};

	useEffect(() => {
		refreshClocks();
	}, []);

	const removeClock = async (id: number) => {
		await Database.remove(id);
		refreshClocks();
	};

	const changeActiveState = async (newActiveState: boolean, id: number) => {
		await Database.changeActiveState(newActiveState, id);
		refreshClocks();
	};

	return (
		<View style={styles.container}>
			<View style={styles.clockListView}>
				<FlatList
					data={clockItems}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item: { id, ...restProps } }) => (
						<ClockItem
							key={id}
							id={id}
							{...restProps}
							onActiveStateToggle={() => changeActiveState(!restProps.isActive, id)}
							onRemoveClock={() => removeClock(id)}
							refreshClocks={refreshClocks}
						/>
					)}
				/>
			</View>
			<View style={styles.iconContainer}>
				<FeatherIcon haveBackground iconName='plus' size='big' onPress={() => navigation.navigate('newClock', { refreshClocks })} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.defaultPrimaryColor,
	},
	clockListView: { flex: 11 },
	iconContainer: {
		flex: 2,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 5,
	},
});

export default ClocksList;
