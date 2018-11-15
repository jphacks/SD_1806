/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react"
import AppNavigator from "./AppNavigator"
import PushNotification from "./libs/PushNotification"

type Props = {}
export default class App extends React.Component<Props> {
  private pushNotification = new PushNotification()

  async componentDidMount() {
    this.pushNotification.requestPermission()
  }

  componentWillUnmount() {
    this.pushNotification.releaseListener()
  }

  render() {
    return <AppNavigator />
  }
}
