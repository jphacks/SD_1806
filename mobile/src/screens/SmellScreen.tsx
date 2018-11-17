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
  "まだ大丈夫ですが要注意",
  "すぐに交換しましょう",
  "中島のおなら",
]
const smellText = [
  "においはほとんどしません。この調子でゴミ箱内を清潔に保ちましょう。",
  "まだ大丈夫ですが、放置しているとにおいが悪化する可能性があります。においの変化には注意を払いましょう",
  "このままですと室内に悪臭が広がる可能性があります。ゴミの量が少なくとも交換することが推奨されます。",
  "うちのチームの中島君のおならと同程度の悪臭です。人体に影響を及ぼす可能性があります。直ちに交換しましょう。",
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
    // let smell = 0
    // setInterval(async () => {
    //   if (smell > 1) smell = 0
    //   else smell += 0.01
    //   this.setState({
    //     smell,
    //   })
    // }, 100)
    setInterval(async () => {
      try {
        const smell = await ApiClient.getSmell()
        this.setState({
          smell: smell / 1013,
        })
      } catch (err) {
        this.setState({
          smell: 0,
        })
      }
    }, 1000)
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
