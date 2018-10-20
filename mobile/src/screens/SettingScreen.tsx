import React from "react"
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

interface State {
  coords: {
    latitude: number
    longitude: number
  }
  config1: boolean
  config2: boolean
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class MainScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      coords: {
        latitude: 0,
        longitude: 0,
      },
      config1: false,
      config2: false,
    }
  }

  getAddress() {}

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
                onEndEditing={() => {}}
              />
            </Right>
          </ListItem>
          <ListItem last>
            <Body>
              <Text>町</Text>
            </Body>
            <Right>
              <Picker
                mode="dropdown"
                iosHeader="Select your SIM"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                selectedValue={"key0"}
                onValueChange={() => {}}
              >
                <Picker.Item label="Wallet" value="key0" />
                <Picker.Item label="ATM Card" value="key1" />
                <Picker.Item label="Debit Card" value="key2" />
                <Picker.Item label="Credit Card" value="key3" />
                <Picker.Item label="Net Banking" value="key4" />
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
              <Text>ゴミ箱喋るよ</Text>
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
