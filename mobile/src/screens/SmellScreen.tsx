import React from "react"
import { StyleSheet, Alert, Image, ImageStyle } from "react-native"
import { Container, Content, Text, View, Col, Row } from "native-base"
import { NavigationScreenProp } from "react-navigation"
import { Circle } from "react-native-progress"
import ApiClient from "../libs/ApiClient"
import Color from "../libs/Color"

interface State {
  smell: number
}
interface Props {
  name: string
  navigation: NavigationScreenProp<any>
}

const smellTitle = [
  "ほとんどにおいません",
  "中島のおなら",
  "まだ大丈夫ですが要注意",
  "すぐに交換しましょう",
]
const smellText = [
  "このままですと室内に悪臭が広がる可能性があります。ゴミの量が少なくとも交換することが推奨されます。",
  "このままですと室内に悪臭が広がる可能性があります。ゴミの量が少なくとも交換することが推奨されます。",
  "このままですと室内に悪臭が広がる可能性があります。ゴミの量が少なくとも交換することが推奨されます。",
  "このままですと室内に悪臭が広がる可能性があります。ゴミの量が少なくとも交換することが推奨されます。",
]

const smellColor = [
  Color.goodSmell,
  Color.normalSmell,
  Color.badSmell,
  Color.yabaiSmell,
]

export default class Screen extends React.Component<Props, State> {
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
        if (smell > 1) smell = 0
        else smell += 0.01
        this.setState({
          smell,
        })
      }, 100)
    } catch (err) {
      Alert.alert("通信に失敗しました。時間をおいてもう一度お試しください。")
    }
  }

  render() {
    let smellLevel: number
    if (this.state.smell < 0.25) smellLevel = 0
    else if (this.state.smell < 0.5) smellLevel = 1
    else if (this.state.smell < 0.75) smellLevel = 2
    else smellLevel = 3

    return (
      <Container>
        <Content
          style={{ flex: 1, marginBottom: 50 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <Row
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 10,
            }}
          >
            <Image
              source={require("../assets/smell_icon.png")}
              style={imgStyles.smellIcon}
            />
            <Text style={styles.mainText}>{this.props.name + "のにおい"}</Text>
          </Row>
          <View
            style={{
              padding: 5,
              alignItems: "center",
            }}
          >
            <Circle
              animated={true}
              color={smellColor[smellLevel]}
              size={220}
              thickness={30}
              progress={this.state.smell}
              showsText={true}
              textStyle={{
                fontWeight: "bold",
                fontSize: 40,
              }}
              formatText={progress => `${Math.round(progress * 100)}%`}
            />
            <Text style={[styles.levelText, { color: smellColor[smellLevel] }]}>
              Lv. {smellLevel + 1}
            </Text>
          </View>
          <View style={{ flex: 4, margin: 5, marginTop: 10 }}>
            <View style={styles.descriptionView}>
              <Text style={[styles.mainText]}>{smellTitle[smellLevel]}</Text>
              <Text style={styles.descriptionText}>
                {smellText[smellLevel]}
              </Text>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

interface ImgStyles {
  smellIcon: ImageStyle
}

const imgStyles = StyleSheet.create<ImgStyles>({
  smellIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    tintColor: Color.main,
    resizeMode: "contain",
  },
})

const styles = StyleSheet.create({
  levelText: {
    color: Color.text,
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 20,
  },
  mainText: {
    color: Color.text,
    fontSize: 25,
    fontWeight: "bold",
  },
  descriptionText: {
    color: Color.textSecandary,
    lineHeight: 25,
    fontSize: 18,
    marginTop: 10,
  },
  descriptionView: {
    alignItems: "center",
    borderColor: Color.border,
    borderWidth: 5,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
})
