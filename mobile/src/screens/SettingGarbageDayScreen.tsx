import React from "react"
import {
  Container,
  Content,
  Text,
  Input,
  List,
  ListItem,
  Separator,
  Right,
  Left,
  Body,
  Picker,
  Radio,
  Icon,
} from "native-base"
import { NavigationScreenProp } from "react-navigation"
import { dayOfWeekToString } from "../libs/Module"
import ApiClient from "../libs/ApiClient"
import { number } from "prop-types"
import Category from "../libs/Category"
import Color from "../libs/Color"

interface State {
  garbageDays: boolean[]
  nthWeeks: boolean[]
  collection: number
  candidate: any
  category: Category
}
interface Props {
  navigation: NavigationScreenProp<any>
}

const wardMap: { [key: string]: number } = {
  青葉区: 0,
  泉区: 1,
  太白区: 2,
  宮城野区: 3,
  若林区: 4,
}

const categoryList = ["家庭ゴミ", "プラスチック", "カン・ビン", "紙類"]
const categoryOptions: JSX.Element[] = []
for (let i = 0; i < 4; i++) {
  categoryOptions.push(
    <Picker.Item key={i} label={categoryList[i]} value={i} />
  )
}

export default class SettingGarbageDayScreen extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)

    const garbageDays = this.props.navigation.state.params.setting.garbageDays
    const nthWeeks = this.props.navigation.state.params.setting.nthWeeks
    const collection = 0
    const candidate: any = []
    const category = 0

    this.state = {
      garbageDays,
      nthWeeks,
      collection,
      candidate,
      category,
    }
  }

  async getAddress(zipcode: string): Promise<void> {
    const url: string = `https://apis.postcode-jp.com/api/postcodes?general=true&normalize=false&office=true&postcode=${zipcode}&startWith=false&apiKey=CTzEFecadvquYhsEVvA4ntiIJ9kEPJGU0Uj3o5q`

    const response = await fetch(url)
    if (!response.ok) {
      console.log("Failed to GET Address.")
      return
    }
    const jsonData = await response.json()
    if (jsonData.size == 0) return
    const town: string = jsonData.data[0].town
    const street = jsonData.data[0].streetFullKana
    const wardID = wardMap[town.substr(3)]
    const kana1 = street[0]
    const kana2 = street[1]
    console.log(jsonData)
    console.log(wardID, kana1, kana2)
    const res = await ApiClient.getCollection(wardID, kana1, kana2)
    this.setState({
      candidate: res,
    })
  }

  addressChange = async (itemValue: number) => {
    console.log(itemValue)
    this.setState({ collection: itemValue })
    const res = await ApiClient.getCollectionDay(itemValue, this.state.category)
    this.setState({
      garbageDays: res.weekday,
      nthWeeks: res.nth,
    })
    this.props.navigation.state.params.changeGarbageDays(res.weekday, res.nth)
  }

  categoryChange = async (itemValue: number) => {
    console.log(itemValue)
    this.setState({ category: itemValue })
    if (this.state.candidate.length > 0) {
      const res = await ApiClient.getCollectionDay(
        this.state.collection,
        itemValue
      )
      this.setState({
        garbageDays: res.weekday,
        nthWeeks: res.nth,
      })
      this.props.navigation.state.params.changeGarbageDays(res.weekday, res.nth)
    }
  }

  onPressDayOfWeekList = (day: number) => {
    let garbageDays = this.state.garbageDays.concat()
    garbageDays[day] = !garbageDays[day]
    this.setState({
      garbageDays,
    })
    this.props.navigation.state.params.changeGarbageDays(
      garbageDays,
      this.state.nthWeeks
    )
  }

  onPressNthWeekList = (nth: number) => {
    let nthWeeks = this.state.nthWeeks.concat()
    nthWeeks[nth] = !nthWeeks[nth]
    this.setState({
      nthWeeks,
    })
    this.props.navigation.state.params.changeGarbageDays(
      this.state.garbageDays,
      nthWeeks
    )
  }

  render() {
    let jushoOptions: JSX.Element[] = []
    for (let i = 0; i < this.state.candidate.length; i++) {
      jushoOptions.push(
        <Picker.Item
          key={i}
          label={this.state.candidate[i].juusho}
          value={this.state.candidate[i].id}
        />
      )
    }

    let dayOfWeekOptions: JSX.Element[] = []
    for (let i = 0; i < 7; i++) {
      dayOfWeekOptions.push(
        <ListItem key={i} onPress={() => this.onPressDayOfWeekList(i)}>
          <Left>
            <Text>{dayOfWeekToString(i)}</Text>
          </Left>
          <Right>
            <Radio selected={this.state.garbageDays[i]} />
          </Right>
        </ListItem>
      )
    }

    let nthWeekOptions: JSX.Element[] = []
    for (let i = 0; i < 4; i++) {
      nthWeekOptions.push(
        <ListItem key={i} onPress={() => this.onPressNthWeekList(i)}>
          <Left>
            <Text>第{i + 1}週</Text>
          </Left>
          <Right>
            <Radio selected={this.state.nthWeeks[i]} />
          </Right>
        </ListItem>
      )
    }

    return (
      <Container>
        <Content>
          <List>
            <Separator bordered>
              <Text style={{ fontSize: 15 }}>
                郵便番号・住所から収集日を設定することが可能です。
              </Text>
            </Separator>
            <ListItem>
              <Body>
                <Text>ゴミの種別</Text>
              </Body>
              <Right>
                <Picker
                  mode="dropdown"
                  iosHeader="ゴミの種別"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.category}
                  onValueChange={itemValue => this.categoryChange(itemValue)}
                >
                  {categoryOptions}
                </Picker>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>郵便番号</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Input
                  style={{ width: 200, textAlign: "right" }}
                  placeholder="お住いの地域の郵便番号"
                  placeholderTextColor={Color.textSecandary}
                  maxLength={10}
                  onChangeText={text => this.getAddress(text)}
                  // value={this.state.text}
                />
              </Right>
            </ListItem>
            <ListItem last>
              <Body>
                <Text>町名</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Picker
                  mode="dropdown"
                  iosHeader="住まいの住所"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.collection}
                  onValueChange={itemValue => this.addressChange(itemValue)}
                >
                  {jushoOptions}
                </Picker>
              </Right>
            </ListItem>
            <Separator bordered>
              <Text>曜日指定</Text>
            </Separator>
            {dayOfWeekOptions}
            <Separator bordered>
              <Text>隔週指定</Text>
            </Separator>
            {nthWeekOptions}
            <Separator />
          </List>
        </Content>
      </Container>
    )
  }
}
