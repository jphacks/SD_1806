import React from "react"
import { Container, Content, Button, Text } from "native-base"

interface State {}
interface Props {}

export default class MainScreen extends React.Component<State, Props> {
  constructor(props: Props) {
    super(props)
  }
  render() {
    return (
      <Container>
        <Content>
          <Button>
            <Text>Click Me!</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}
