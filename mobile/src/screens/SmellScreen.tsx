import React from "react"
import { StyleSheet, Alert, AsyncStorage } from "react-native"
import { Container, Content, Button, Icon, Text, View, Col } from "native-base"
import { NavigationScreenProp } from "react-navigation"
import { Circle } from "react-native-progress"
import ApiClient from "../libs/ApiClient"
import Color from "../libs/Color"

interface State {
  smell: number
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class Screen extends React.Component<Props, State> {
  private name = ""
  constructor(props: Props) {
    super(props)

    this.state = {
      smell: 0,
    }
  }

  async componentDidMount() {
    try {
      let smell = 0
      setInterval(async () => {
        smell += 0.01
        this.setState({
          smell,
        })
      }, 1000)
      let storeName = await AsyncStorage.getItem("name")
      if (storeName === null) storeName = "未設定"
      this.name = storeName
    } catch (err) {
      Alert.alert("通信に失敗しました。時間をおいてもう一度お試しください。")
    }
  }

  render() {
    let smellColor: string
    if (this.state.smell < 0.25) smellColor = Color.goodSmell
    else if (this.state.smell < 0.5) smellColor = Color.normalSmell
    else if (this.state.smell < 0.75) smellColor = Color.badSmell
    else smellColor = Color.yabaiSmell

    return (
      <Container>
        <Content style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.mainText}>{this.name + "のにおい指数"}</Text>
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Circle
              animated={true}
              color={smellColor}
              size={250}
              thickness={20}
              progress={this.state.smell}
              showsText={true}
              formatText={progress => `${Math.round(progress * 100)}`}
            />
          </View>
          <View style={{ flex: 3, alignItems: "center" }}>
            <Text
              style={[styles.mainText, { color: smellColor, marginTop: 10 }]}
            >
              においやばい
            </Text>
            <Text style={styles.descriptionText}>
              このままですと室内に悪臭が立ち込める可能性があるので、ゴミの量が少なくとも交換することが推奨されます。
            </Text>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mainText: {
    color: Color.text,
    fontSize: 30,
    fontWeight: "bold",
  },
  descriptionText: {
    color: Color.textSecandary,
    lineHeight: 20,
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 15,
  },
})
