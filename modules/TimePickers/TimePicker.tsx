import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Dimensions, Vibration } from 'react-native';
import colors from '../../colors';

const hours = [];
for (let i = 0; i < 24; i++) {
	hours.push(i);
}

const minutes = [];
for (let j = 0; j < 60; j += 5) {
	minutes.push(j);
}

interface TimePickerProps {
	mode: 'hour' | 'minute';
	setHour: (hour: number) => void;
	setMinute: (minute: number) => void;
	setSelectMode: (mode: 'hour' | 'minute') => void;
}

const HourPicker: React.FC<TimePickerProps> = ({ mode, setHour, setMinute, setSelectMode }) => {
	const [height] = useState<number>(Dimensions.get('window').height);
	const [width] = useState<number>(Dimensions.get('window').width);
	const commonStyles: any = {
		position: 'absolute',
		backgroundColor: colors.darkPrimaryColor,
		borderRadius: 666,
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<View style={{ position: 'relative', width, height, left: width / 2, top: height / 2 - 80 }}>
			{mode === 'hour'
				? hours.map(hour => (
						<TouchableOpacity
							key={hour}
							onPress={() => {
								Vibration.vibrate(100);
								setHour(hour);
								setSelectMode('minute');
							}}
							style={{
								...commonStyles,
								width: hour < 12 ? 50 : 35,
								height: hour < 12 ? 50 : 35,
								top:
									(hour < 12 ? width * 0.4 : width * 0.3) * Math.sin(((hour % 12) * 30 - 90) * (Math.PI / 180)) +
									(hour < 12 ? 0 : 15),
								left: (hour < 12 ? width * 0.4 : width * 0.3) * Math.cos(((hour % 12) * 30 - 90) * (Math.PI / 180)), // - (hour < 12 ? 30 : 15),
							}}
						>
							<Text style={{ color: 'white', fontSize: hour < 12 ? 30 : 20 }}> {String(hour).padStart(2, '0')} </Text>
						</TouchableOpacity>
				  ))
				: minutes.map(minute => (
						<TouchableOpacity
							key={minute}
							onPress={() => {
								Vibration.vibrate(100);
								setMinute(minute);
							}}
							style={{
								...commonStyles,
								width: 45,
								height: 45,
								top: width * 0.4 * Math.sin(((minute / 5) * 30 - 90) * (Math.PI / 180)),
								left: width * 0.4 * Math.cos(((minute / 5) * 30 - 90) * (Math.PI / 180)),
							}}
						>
							<Text style={{ color: 'white', fontSize: 30 }}> {String(minute).padStart(2, '0')} </Text>
						</TouchableOpacity>
				  ))}
		</View>
	);
};
export default HourPicker;
