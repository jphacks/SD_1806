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
            source={require("../assets/dustbox.png")}
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
              marginTop: 280
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
