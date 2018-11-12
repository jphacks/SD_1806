import React from "react"
import { AsyncStorage, Alert } from "react-native"
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
  Body,
  Button,
  Picker,
  Switch,
} from "native-base"
import { NavigationScreenProp } from "react-navigation"
import ApiClient from "../libs/ApiClient"
import DayOfWeek from "../libs/DayOfWeek"

interface State {
  garbageDay: DayOfWeek
  collection: number
  candidate: any
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class SettingGarbageDayScreen extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)

    this.state = {
      garbageDay: DayOfWeek.none,
      collection: 0,
      candidate: [],
    }
  }

  async componentDidMount() {
    try {
      const storeGarbageDay = await AsyncStorage.getItem("garbageDay")

      let garbageDay
      if (storeGarbageDay === null) garbageDay = DayOfWeek.Monday
      else garbageDay = parseInt(storeGarbageDay)

      this.setState({
        garbageDay,
      })
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
  }

  async getAddress(zipcode: string): Promise<void> {
    const url: string = `https://apis.postcode-jp.com/api/postcodes?general=true&normalize=false&office=true&postcode=${zipcode}&startWith=false&apiKey=CTzEFecadvquYhsEVvA4ntiIJ9kEPJGU0Uj3o5q`

    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET Address."
    const jsonData = await response.json()
    const town = jsonData.data[0].town
    const street = jsonData.data[0].streetFullKana
    const ku = town.substr(3)
    const kana1 = street[0]
    const kana2 = street[1]
    await ApiClient.getCollection(ku, kana1, kana2)
    const res = await ApiClient.getCollection(ku, kana1, kana2)
    this.setState({
      candidate: res,
    })
  }

  addressChange = async (itemValue: number) => {
    await ApiClient.postConfigID(itemValue.toString())
    console.log(itemValue)
    this.setState({ collection: itemValue })
  }

  changeGarbageDay = async (day: number) => {
    try {
      await AsyncStorage.setItem("day", day.toString())
    } catch (error) {
      Alert.alert("設定の保存に失敗しました。")
    }
    this.setState({
      garbageDay: day,
    })
    this.props.navigation.state.params.changeSetting()
  }

  render() {
    let items: JSX.Element[] = []
    for (let i = 0; i < this.state.candidate.length; i++) {
      items.push(
        <Picker.Item
          key={i}
          label={this.state.candidate[i].juusho}
          value={this.state.candidate[i].id}
        />
      )
    }

    return (
      <Container>
        <Content>
          <List>
            <ListItem>
              <Left>
                <Text>ゴミ捨て日</Text>
              </Left>
              <Right>
                <Picker
                  mode="dropdown"
                  iosHeader="ゴミ捨て日"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.garbageDay}
                  onValueChange={itemValue => this.changeGarbageDay(itemValue)}
                >
                  <Picker.Item label={"日曜日"} value={DayOfWeek.Sunday} />
                  <Picker.Item label={"月曜日"} value={DayOfWeek.Monday} />
                  <Picker.Item label={"火曜日"} value={DayOfWeek.Tuesday} />
                  <Picker.Item label={"水曜日"} value={DayOfWeek.Wednesday} />
                  <Picker.Item label={"木曜日"} value={DayOfWeek.Thursday} />
                  <Picker.Item label={"金曜日"} value={DayOfWeek.Friday} />
                  <Picker.Item label={"土曜日"} value={DayOfWeek.Saturday} />
                </Picker>
              </Right>
            </ListItem>
            <Separator bordered />
            <ListItem>
              <Body>
                <Text>郵便番号</Text>
              </Body>
              <Right>
                <Input
                  style={{ width: 90 }}
                  maxLength={7}
                  onEndEditing={e => this.getAddress(e.nativeEvent.text)}
                />
              </Right>
            </ListItem>
            <ListItem last>
              <Body>
                <Text>町名</Text>
              </Body>
              <Right>
                <Picker
                  mode="dropdown"
                  iosHeader="住まいの住所"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.collection}
                  onValueChange={itemValue => this.addressChange(itemValue)}
                >
                  {items}
                </Picker>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}
