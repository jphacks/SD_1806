import firebase from "react-native-firebase"
import ApiClient from "./ApiClient"
import { Alert } from "react-native"

export default class PushNotification {
  private onTokenRefreshListener: any
  private notificationOpenedListener: any
  private notificationListener: any

  constructor() {}

  async setup() {
    if (await this.checkPermission()) {
      await this.setupToken()
      await this.setupListener()
    } else {
      if (await this.requestPermission()) {
        await this.setupToken()
        await this.setupListener()
      }
    }
  }

  async checkPermission() {
    return await firebase.messaging().hasPermission()
  }

  async requestPermission() {
    return await firebase.messaging().requestPermission()
  }

  private setupToken = async () => {
    // デバイストークンを取得
    const token = await firebase.messaging().getToken()
    await ApiClient.setToken(token)
    // Alert.alert("setupToken")
  }

  private setupListener = async () => {
    // Alert.alert("setupListener")

    // 新しいトークンの生成がされた時
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(fcmToken => {
        console.log(fcmToken)
        ApiClient.setToken(fcmToken)
      })

    // ① プッシュ通知を押してクローズからの起動
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification()
    if (notificationOpen) {
      console.log(notificationOpen)
    }

    // ② プッシュ通知を押してバックグラウンドからの復帰
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log(notificationOpen)
      })

    // ③ アプリが起動中にプッシュ通知が来た時
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        notification.setSound("default")
        firebase.notifications().displayNotification(notification)
      })
  }

  releaseListener = () => {
    if (!this.checkPermission()) return
    if (this.onTokenRefreshListener != undefined) {
      this.onTokenRefreshListener()
    }
    this.notificationOpenedListener()
    this.notificationListener()
  }
}
