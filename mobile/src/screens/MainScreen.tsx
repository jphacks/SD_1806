import React from "react";
import { Image } from "react-native";
import { Container, Content, Button, Icon, Text } from "native-base";
import { NavigationScreenProp } from "react-navigation";

interface State {
  amount: number;
}
interface Props {
  navigation: NavigationScreenProp<any>;
}

export default class MainScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      amount: 0
    };
  }

  render() {
    let img_dustbox;
    switch (this.state.amount) {
      case 0:
        img_dustbox = require("../assets/dustbox.png");
        break;
      case 1:
        img_dustbox = require("../assets/dustbox_25.png");
        break;
      case 2:
        img_dustbox = require("../assets/dustbox_50.png");
        break;
      case 3:
        img_dustbox = require("../assets/dustbox_75.png");
        break;
      case 4:
        img_dustbox = require("../assets/dustbox_100.png");
        break;
      default:
        img_dustbox = require("../assets/dustbox.png");
        break;
    }

    return (
      <Container>
        <Content>
          <Text
            style={{
              color: "#5cb85c",
              alignSelf: "center",
              justifyContent: "center",
              fontSize: 60,
              fontWeight: "bold",
              marginTop: 30
            }}
          >
            {"燃えるゴミ"}
          </Text>
          <Image
            source={img_dustbox}
            style={{
              width: 300,
              height: 300,
              marginTop: 50,
              alignSelf: "center",
              tintColor: "#5cb85c"
            }}
          />
          <Text
            style={{
              color: "#5cb85c",
              position: "absolute",
              alignSelf: "center",
              fontSize: 60,
              fontWeight: "bold",
              marginTop: 290
            }}
          >
            {this.state.amount + "%"}
          </Text>
          <Button
            transparent
            large
            onPress={() => {
              this.props.navigation.navigate("Setting");
            }}
            success
            style={{ marginTop: 20, alignSelf: "center", height: 100 }}
          >
            <Icon name="settings" style={{ fontSize: 100 }} />
          </Button>
        </Content>
      </Container>
    );
  }
}
