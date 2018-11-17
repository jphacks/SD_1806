import React from "react"
import { AsyncStorage, Alert, TouchableOpacity } from "react-native"
import {
  Container,
  Content,
  Text,
  Icon,
  Input,
  List,
  ListItem,
  Separator,
  Right,
  Left,
  Picker,
  Switch,
} from "native-base"
import { NavigationScreenProp } from "react-navigation"
import Setting from "../interface/Setting"
import DayOfWeek from "../libs/DayOfWeek"
import { daysOfWeekToString, nthWeekToString } from "../libs/Module"
import DateTimePicker from "react-native-modal-datetime-picker"
import { bool } from "prop-types"
import ApiClient from "../libs/ApiClient"
import Color from "../libs/Color"

interface State {
  setting: Setting
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class SettingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const setting: Setting = {
      name: "",
      garbageDays: new Array<boolean>(7).fill(false),
      nthWeeks: new Array<boolean>(4).fill(false),
      notification: true,
      notificationTime: "07:00",
    }

    this.state = {
      setting,
    }
  }

  async componentDidMount() {
    try {
      const storeName = await AsyncStorage.getItem("name")
      const storeGarbageDays = await AsyncStorage.getItem("garbageDays")
      const storeNthWeek = await AsyncStorage.getItem("nthWeeks")
      const storeNotification = await AsyncStorage.getItem("notification")
      const storeNotificationTime = await AsyncStorage.getItem(
        "notificationTime"
      )
      let name: string
      let garbageDays: boolean[]
      let nthWeeks: boolean[]
      let notification: boolean
      let notificationTime: string
      if (storeName === null) name = ""
      else name = storeName
      if (storeGarbageDays === null)
        garbageDays = new Array<boolean>(7).fill(false)
      else garbageDays = storeGarbageDays.split(",").map(x => x == "true")
      if (storeNthWeek === null) nthWeeks = new Array<boolean>(4).fill(false)
      else nthWeeks = storeNthWeek.split(",").map(x => x == "true")
      if (storeNotification === null) notification = true
      else notification = storeNotification == "true"
      if (storeNotificationTime === null) notificationTime = "07:00"
      else notificationTime = storeNotificationTime

      const setting: Setting = {
        name,
        garbageDays,
        nthWeeks,
        notification,
        notificationTime,
      }

      this.setState({
        setting,
      })
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
  }

  changeName = async (name: string) => {
    try {
      await AsyncStorage.setItem("name", name)
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        name: name,
      }
      return {
        setting: updateSetting,
      }
    })
    this.props.navigation.state.params.changeSetting()
    ApiClient.postConfig(this.state.setting)
  }

  changeGarbageDays = async (day: boolean[], nthWeeks: boolean[]) => {
    console.log("changeGarbageDays")
    console.log(day, nthWeeks)
    try {
      await AsyncStorage.setItem("garbageDays", day.toString())
      await AsyncStorage.setItem("nthWeeks", nthWeeks.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        garbageDays: day,
        nthWeeks,
      }
      console.log(updateSetting)
      return {
        setting: updateSetting,
      }
    })
    this.props.navigation.state.params.changeSetting()
    ApiClient.postConfig(this.state.setting)
  }

  changeNotification = async (notification: boolean) => {
    try {
      await AsyncStorage.setItem("notification", notification.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        notification,
      }
      return {
        setting: updateSetting,
      }
    })
    this.props.navigation.state.params.changeSetting()
    ApiClient.postConfig(this.state.setting)
  }

  changeNotificationTime = async (notificationTime: string) => {
    try {
      await AsyncStorage.setItem("notificationTime", notificationTime)
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        notificationTime,
      }
      return {
        setting: updateSetting,
      }
    })
    this.props.navigation.state.params.changeSetting()
    ApiClient.postConfig(this.state.setting)
  }

  render() {
    let timeOptions: JSX.Element[] = []
    for (let i = 0; i < 24; i++) {
      timeOptions.push(
        <Picker.Item key={i} label={i + "時"} value={i.toString()} />
      )
    }
    return (
      <Container>
        <Content>
          <List>
            <Separator bordered>
              <Text>ゴミ箱の設定</Text>
            </Separator>
            <ListItem>
              <Left>
                <Text>ゴミの種類</Text>
              </Left>
              <Right>
                <Input
                  style={{ width: 200, textAlign: "right" }}
                  placeholder="ゴミの種類"
                  placeholderTextColor={Color.textSecandary}
                  maxLength={10}
                  onChangeText={text => this.changeName(text)}
                  value={this.state.setting.name}
                />
              </Right>
            </ListItem>

            <ListItem
              last
              onPress={() => {
                this.props.navigation.navigate("SettingGarbageDay", {
                  changeGarbageDays: this.changeGarbageDays,
                  setting: this.state.setting,
                })
              }}
            >
              <Left>
                <Text>ゴミ収集日</Text>
              </Left>
              <Right
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Icon style={{ marginLeft: 20 }} name="arrow-forward" />
                <Text>
                  {nthWeekToString(this.state.setting.nthWeeks) +
                    daysOfWeekToString(this.state.setting.garbageDays)}
                </Text>
              </Right>
            </ListItem>

            <Separator bordered>
              <Text>Push通知設定</Text>
            </Separator>
            <ListItem>
              <Left>
                <Text>通知</Text>
              </Left>
              <Right>
                <Switch
                  value={this.state.setting.notification}
                  onValueChange={() =>
                    this.changeNotification(!this.state.setting.notification)
                  }
                />
              </Right>
            </ListItem>
            <ListItem last>
              <Left>
                <Text>通知の時間帯</Text>
              </Left>
              <Right>
                <Picker
                  mode="dropdown"
                  iosHeader="通知の時間帯"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.setting.notificationTime}
                  onValueChange={itemValue =>
                    this.changeNotificationTime(itemValue)
                  }
                >
                  {timeOptions}
                </Picker>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}
