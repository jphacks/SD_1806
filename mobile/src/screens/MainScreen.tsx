import React from "react";
import { Container, Content, Button, Icon } from "native-base";
import { NavigationScreenProp } from "react-navigation";

interface State {}
interface Props {
  navigation: NavigationScreenProp<any>;
}

export default class MainScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <Button
            transparent
            large
            onPress={() => {
              this.props.navigation.navigate("Setting");
            }}
          >
            <Icon name="settings" />
          </Button>
        </Content>
      </Container>
    );
  }
}
