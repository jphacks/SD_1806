import { createStackNavigator } from "react-navigation"
import Main from "./screens/MainScreen"

export const rootScreen = "Main"

const AppNavigator = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: () => ({
      title: "Gomi",
    }),
  },
})

export default AppNavigator
