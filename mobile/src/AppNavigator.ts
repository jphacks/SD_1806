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
      title: "すごいゴミ箱",
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
      title: "ゴミ収集日の設定",
    }),
  },
  Smell: {
    screen: Smell,
    navigationOptions: () => ({
      title: "におい画面",
    }),
  },
})

export default AppNavigator
