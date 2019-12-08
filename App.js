import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import colors from "./colors";
import FrontPage from "./screens/FrontPage";
import ClocksList from "./screens/ClocksList";
import NewClock from "./screens/NewClock";

const Root = createStackNavigator({
  front: {
    screen: FrontPage,
    navigationOptions: {
      headerShown: false
    }
  },
  clocksList: {
    screen: ClocksList,
    navigationOptions: {
      title: "Clocks list",
      headerStyle: {
        height: 60,
        backgroundColor: colors.darkPrimaryColor
      },
      headerTitleStyle: {
        color: colors.textPrimaryColor
      }
    }
  },
  newClock: {
    screen: NewClock,
    navigationOptions: {
      title: "Add clock",
      headerStyle: {
        height: 60,
        backgroundColor: colors.darkPrimaryColor
      },
      headerTitleStyle: {
        color: colors.textPrimaryColor
      }
    }
  }
});

const App = createAppContainer(Root);

export default App;
