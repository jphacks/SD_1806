import React from "react"
import { AsyncStorage, Alert } from "react-native"
import {
  Container,
  Content,
  Text,
  Icon,
  Input,
  ListItem,
  Switch,
  Separator,
  Body,
  Right,
  Picker,
} from "native-base"
import { NavigationScreenProp } from "react-navigation"
import ApiClient from "../libs/ApiClient"

interface State {
  config1: boolean
  config2: boolean
  candidate: any
  address_id: number
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class MainScreen extends React.Component<Props, State> {
  private items: JSX.Element[]

  constructor(props: Props) {
    super(props)
    this.items = []
    this.state = {
      config1: false,
      config2: false,
      candidate: [],
      address_id: 0,
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
    console.log(ku, kana1, kana2)
    const res = await ApiClient.getCollection(ku, kana1, kana2)
    console.log(res)
    this.items = []
    for (let i = 0; i < res.length; i++) {
      this.items.push(
        <Picker.Item key={res[i].id} label={res[i].juusho} value={res[i].id} />
      )
    }
    this.setState({
      candidate: res,
    })
  }

  addressChange = async (itemValue: number) => {
    console.log(itemValue)
    if (itemValue == null) return
    for (let i = 0; i < this.state.candidate.length; i++) {
      if (this.state.candidate[i].id == itemValue) {
        await ApiClient.postConfigID(itemValue.toString())
        try {
          // await AsyncStorage.setItem("address_id", itemValue.toString())
          // await AsyncStorage.setItem("juusho", this.state.candidate[i].jusho)
          // await AsyncStorage.setItem("kamirui", this.state.candidate[i].kamirui)
          // await AsyncStorage.setItem("kanbin", this.state.candidate[i].kanbin)
          // await AsyncStorage.setItem("katei", this.state.candidate[i].katei)
          // await AsyncStorage.setItem("pura", this.state.candidate[i].pura)
        } catch (error) {
          // Error saving data
          Alert.alert("設定の保存に失敗しました。")
        }
        this.setState({ address_id: itemValue })
        break
      }
    }
  }

  render() {
    return (
      <Container>
        <Content>
          {/* // Text input box with icon aligned to the right */}

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
                selectedValue={this.state.address_id}
                onValueChange={itemValue => this.addressChange(itemValue)}
              >
                {this.items}
              </Picker>
            </Right>
          </ListItem>
          <Separator bordered>
            <Text>通知設定</Text>
          </Separator>
          <ListItem>
            <Body>
              <Text>ゴミ捨て日の通知</Text>
            </Body>
            <Right>
              <Switch
                value={this.state.config1}
                onValueChange={() => {
                  this.setState({ config1: !this.state.config1 })
                }}
              />
            </Right>
          </ListItem>
          <ListItem last>
            <Body>
              <Text>ゴミ箱の音声通知</Text>
            </Body>
            <Right>
              <Switch
                value={this.state.config2}
                onValueChange={() => {
                  this.setState({ config2: !this.state.config2 })
                }}
              />
            </Right>
          </ListItem>
        </Content>
      </Container>
    )
  }
}
