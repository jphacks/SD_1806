import firebase from "react-native-firebase"
import ApiClient from "./ApiClient"

export default class PushNotification {
  private onTokenRefreshListener: any
  private notificationOpenedListener: any
  private notificationListener: any

  constructor() {}

  async setup() {
    if (await this.checkPermission()) {
      this.setupToken()
      this.setupListener()
    } else {
      if (await this.requestPermission()) {
        this.setupToken()
        this.setupListener()
      }
    }
  }

  async checkPermission() {
    return await firebase.messaging().hasPermission()
  }

  async requestPermission() {
    const enabled = await firebase.messaging().hasPermission()
    if (enabled) {
      firebase
        .messaging()
        .getToken()
        .then(token => {
          console.log("TOKEN Generated", token)
        })
    } else {
      console.log("Permission denied")
      await firebase.messaging().requestPermission()
    }
    return enabled
  }

  private setupToken = () => {
    // デバイストークンを取得
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        console.log(fcmToken)
        ApiClient.setToken(fcmToken)
      })

    // 新しいトークンの生成がされた時
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(fcmToken => {
        console.log(fcmToken)
        ApiClient.setToken(fcmToken)
      })
  }

  private setupListener = async () => {
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
        console.log(notification)
        // notification.setSound("default")
        firebase.notifications().displayNotification(notification)
      })
  }

  releaseListener = () => {
    if (!this.checkPermission()) return
    this.onTokenRefreshListener()
    this.notificationOpenedListener()
    this.notificationListener()
  }
}
