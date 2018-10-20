import React from "react";
import {
  Container,
  Content,
  Button,
  Text,
  Icon,
  Input,
  ListItem,
  Switch,
  Separator,
  Body,
  Right
} from "native-base";
import { NavigationScreenProp } from "react-navigation";

interface State {
  coords: {
    latitude: number;
    longitude: number;
  };
  config1: boolean;
  config2: boolean;
}
interface Props {
  navigation: NavigationScreenProp<any>;
}

export default class MainScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      coords: {
        latitude: 0,
        longitude: 0
      },
      config1: false,
      config2: false
    };
  }

  onPressButton = async () => {
    try {
      const position: any = await getPosition(5000);
      const { latitude, longitude } = position.coords;
      this.setState({
        coords: {
          latitude,
          longitude
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  render() {
    return (
      <Container>
        <Content>
          {/* // Text input box with icon aligned to the right */}

          <Separator bordered>
            <Text>地域</Text>
          </Separator>
          <ListItem last>
            <Body>
              <Input
                value={
                  String(this.state.coords.latitude) +
                  " " +
                  String(this.state.coords.longitude)
                }
                style={{
                  borderWidth: 0.2,
                  borderRadius: 5
                }}
              />
            </Body>
            <Right>
              <Button onPress={this.onPressButton}>
                <Icon active name="navigate" />
              </Button>
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
                  this.setState({ config1: !this.state.config1 });
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
                  this.setState({ config2: !this.state.config2 });
                }}
              />
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

async function getPosition(timeoutMillis = 10000) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: timeoutMillis
    });
  });
}
