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
} from "native-base"
import { NavigationScreenProp } from "react-navigation"
import { dayOfWeekToString } from "../libs/Module"

interface State {
  garbageDays: boolean[]
  nthWeeks: boolean[]
  // collection: number
  // candidate: any
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

    const garbageDays = this.props.navigation.state.params.setting.garbageDays
    const nthWeeks = this.props.navigation.state.params.setting.nthWeeks

    this.state = {
      garbageDays,
      nthWeeks,
    }
  }

  // async getAddress(zipcode: string): Promise<void> {
  //   const url: string = `https://apis.postcode-jp.com/api/postcodes?general=true&normalize=false&office=true&postcode=${zipcode}&startWith=false&apiKey=CTzEFecadvquYhsEVvA4ntiIJ9kEPJGU0Uj3o5q`

  //   const response = await fetch(url)
  //   if (!response.ok) throw "Failed to GET Address."
  //   const jsonData = await response.json()
  //   const town = jsonData.data[0].town
  //   const street = jsonData.data[0].streetFullKana
  //   const ku = town.substr(3)
  //   const kana1 = street[0]
  //   const kana2 = street[1]
  //   await ApiClient.getCollection(ku, kana1, kana2)
  //   const res = await ApiClient.getCollection(ku, kana1, kana2)
  //   this.setState({
  //     candidate: res,
  //   })
  // }

  // addressChange = async (itemValue: number) => {
  //   // await ApiClient.postConfigID(itemValue.toString())
  //   console.log(itemValue)
  //   this.setState({ collection: itemValue })
  // }

  // changeGarbageDay = async (day: number) => {
  //   try {
  //     await AsyncStorage.setItem("day", day.toString())
  //   } catch (error) {
  //     Alert.alert("設定の保存に失敗しました。")
  //   }
  //   this.setState({
  //     garbageDay: day,
  //   })
  //   this.props.navigation.state.params.changeSetting()
  // }

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
    // let items: JSX.Element[] = []
    // for (let i = 0; i < this.state.candidate.length; i++) {
    //   items.push(
    //     <Picker.Item
    //       key={i}
    //       label={this.state.candidate[i].juusho}
    //       value={this.state.candidate[i].id}
    //     />
    //   )
    // }

    let dayOfWeekList: JSX.Element[] = []
    for (let i = 0; i < 7; i++) {
      dayOfWeekList.push(
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

    let nthWeekList: JSX.Element[] = []
    for (let i = 0; i < 4; i++) {
      nthWeekList.push(
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
              <Text>隔週指定</Text>
            </Separator>
            {nthWeekList}
            <Separator bordered>
              <Text>曜日指定</Text>
            </Separator>
            {dayOfWeekList}
            <Separator />
            <Separator style={{ paddingBottom: 20 }}>
              <Text style={{ fontSize: 15 }}>
                お住いの地域のゴミ捨て日がわからない場合は
              </Text>
              <Text style={{ fontSize: 15 }}>
                郵便番号・住所から取得することも可能です。
              </Text>
            </Separator>
            <ListItem>
              <Body>
                <Text>郵便番号</Text>
              </Body>
              <Right>
                <Input
                  style={{ width: 90 }}
                  maxLength={7}
                  // onChangeText={text => this.getAddress(text)}
                />
              </Right>
            </ListItem>
            <ListItem last>
              <Body>
                <Text>町名</Text>
              </Body>
              <Right>
                {/* <Picker
                  mode="dropdown"
                  iosHeader="住まいの住所"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={this.state.collection}
                  onValueChange={itemValue => this.addressChange(itemValue)}
                >
                  {items}
                </Picker> */}
              </Right>
            </ListItem>
            <Separator />
          </List>
        </Content>
      </Container>
    )
  }
}
