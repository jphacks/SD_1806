import { createStackNavigator } from "react-navigation"
import Main from "./screens/MainScreen"
import Setting from "./screens/SettingScreen"
import SettingGarbageDay from "./screens/SettingGarbageDayScreen"
import Smell from "./screens/SmellScreen"

export const rootScreen = "Main"

const AppNavigator = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: () => ({
      title: "すごいゴミ箱（仮）",
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
  Smell: {
    screen: Smell,
    navigationOptions: () => ({
      title: "SettingGarbageDay",
    }),
  },
})

export default AppNavigator
