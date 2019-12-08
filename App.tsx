import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Audio } from 'expo-av';
import colors from './colors';
import FrontPage from './screens/FrontPage';
import ClocksList from './screens/ClocksList';
import NewClock from './screens/NewClock';

Audio.setAudioModeAsync({
	allowsRecordingIOS: false,
	interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
	playsInSilentModeIOS: true,
	shouldDuckAndroid: true,
	interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
	staysActiveInBackground: true,
	playThroughEarpieceAndroid: false,
});

Audio.setIsEnabledAsync(true);

const Root = createStackNavigator({
	front: {
		screen: FrontPage,
		navigationOptions: {
			headerShown: false,
		},
	},
	clocksList: {
		screen: ClocksList,
		navigationOptions: {
			title: 'Clocks list',
			headerStyle: {
				height: 60,
				backgroundColor: colors.darkPrimaryColor,
			},
			headerTitleStyle: {
				color: colors.textPrimaryColor,
			},
		},
	},
	newClock: {
		screen: NewClock,
		navigationOptions: {
			title: 'Add clock',
			headerStyle: {
				height: 60,
				backgroundColor: colors.darkPrimaryColor,
			},
			headerTitleStyle: {
				color: colors.textPrimaryColor,
			},
		},
	},
});

const App = createAppContainer(Root);

export default App;
