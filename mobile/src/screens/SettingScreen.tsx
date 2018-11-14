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
import { dayOfWeekToString } from "../libs/Module"

interface State {
  setting: Setting
  address_id: string
  candidate: any
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class SettingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const setting: Setting = {
      name: "",
      garbageDay: DayOfWeek.Monday,
      notificationDay: DayOfWeek.Monday,
      notificationTime: 0,
      notificationSound: true,
    }

    this.state = {
      setting,
      address_id: "undefined",
      candidate: [],
    }
  }

  async componentDidMount() {
    try {
      const storeName = await AsyncStorage.getItem("name")
      const storeGarbageDay = await AsyncStorage.getItem("garbageDay")
      const storeNotificationDay = await AsyncStorage.getItem("notificationDay")
      const storeNotificationTime = await AsyncStorage.getItem(
        "notificationTime"
      )
      const storeNotificationSound = await AsyncStorage.getItem(
        "notificationSound"
      )
      let name, garbageDay, notificationDay, notificationTime, notificationSound
      if (storeName === null) name = ""
      else name = storeName
      if (storeGarbageDay === null) garbageDay = DayOfWeek.Monday
      else garbageDay = parseInt(storeGarbageDay)
      if (storeNotificationDay === null) notificationDay = DayOfWeek.Monday
      else notificationDay = parseInt(storeNotificationDay)
      if (storeNotificationTime === null) notificationTime = 0
      else notificationTime = parseInt(storeNotificationTime)
      if (storeNotificationSound === null) notificationSound = true
      else notificationSound = storeNotificationSound == "true"

      const setting: Setting = {
        name,
        garbageDay,
        notificationDay,
        notificationTime,
        notificationSound,
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
  }

  changeGarbageDay = async (day: number) => {
    try {
      await AsyncStorage.setItem("day", day.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        day: day,
      }
      return {
        setting: updateSetting,
      }
    })
    this.props.navigation.state.params.changeSetting()
  }

  changeNotificationDay = async (day: number) => {
    try {
      await AsyncStorage.setItem("notificationDay", day.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        notificationDay: day,
      }
      return {
        setting: updateSetting,
      }
    })
  }

  changeNotificationTime = async (time: number) => {
    try {
      await AsyncStorage.setItem("notificationTime", time.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        notificationTime: time,
      }
      return {
        setting: updateSetting,
      }
    })
  }

  changeNotificationSound = async (notify: boolean) => {
    try {
      await AsyncStorage.setItem("notificationSound", notify.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState(prevState => {
      const updateSetting = {
        ...prevState.setting,
        notificationSound: notify,
      }
      return {
        setting: updateSetting,
      }
    })
  }

  render() {
    let timeOptions: JSX.Element[] = []
    for (let i = 0; i < 24; i++) {
      timeOptions.push(<Picker.Item key={i} label={i + "時"} value={i} />)
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
                  placeholder="Underline Textbox"
                  maxLength={10}
                  onChangeText={text => this.changeName(text)}
                  value={this.state.setting.name}
                />
              </Right>
            </ListItem>
            <ListItem last>
              <Left>
                <Text>ゴミ捨て日</Text>
              </Left>
              <Right
                style={{ flexDirection: "row-reverse", alignItems: "center" }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("SettingGarbageDay")
                  }}
                >
                  <Icon style={{ marginLeft: 20 }} name="arrow-forward" />
                </TouchableOpacity>
                <Text>{dayOfWeekToString(this.state.setting.garbageDay)}</Text>
              </Right>
            </ListItem>

            <Separator bordered>
              <Text>Push通知設定</Text>
            </Separator>
            <ListItem>
              <Left>
                <Text>通知曜日</Text>
              </Left>
              <Right>
                <Picker
                  mode="dropdown"
                  iosHeader="通知曜日"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.setting.notificationDay}
                  onValueChange={itemValue =>
                    this.changeNotificationDay(itemValue)
                  }
                >
                  <Picker.Item label={"日曜日"} value={DayOfWeek.Sunday} />
                  <Picker.Item label={"月曜日"} value={DayOfWeek.Monday} />
                  <Picker.Item label={"火曜日"} value={DayOfWeek.Tuesday} />
                  <Picker.Item label={"水曜日"} value={DayOfWeek.Wednesday} />
                  <Picker.Item label={"木曜日"} value={DayOfWeek.Thursday} />
                  <Picker.Item label={"金曜日"} value={DayOfWeek.Friday} />
                  <Picker.Item label={"土曜日"} value={DayOfWeek.Saturday} />
                  <Picker.Item label={"通知なし"} value={DayOfWeek.none} />
                </Picker>
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

            <Separator bordered>
              <Text>音声通知設定</Text>
            </Separator>
            <ListItem last>
              <Left>
                <Text>ゴミ箱おしゃべりモード</Text>
              </Left>
              <Right>
                <Switch
                  value={this.state.setting.notificationSound}
                  onValueChange={() =>
                    this.changeNotificationSound(
                      !this.state.setting.notificationSound
                    )
                  }
                />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}
