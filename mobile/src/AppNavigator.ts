import { createStackNavigator } from "react-navigation"
import Main from "./screens/MainScreen"
import Setting from "./screens/SettingScreen"
import SettingGarbageDay from "./screens/SettingGarbageDayScreen"

export const rootScreen = "Main"

const AppNavigator = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: () => ({
      title: "Gomi",
    }),
  },
  Setting: {
    screen: Setting,
    navigationOptions: () => ({
      title: "Setting",
    }),
  },
  SettingGarbageDay: {
    screen: SettingGarbageDay,
    navigationOptions: () => ({
      title: "SettingGarbageDay",
    }),
  },
})

export default AppNavigator
