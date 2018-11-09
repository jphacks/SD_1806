import React from "react"
import { Image, ImageStyle, StyleSheet, Alert } from "react-native"
import { Container, Content, Button, Icon, Text, View, Col } from "native-base"
import { NavigationScreenProp } from "react-navigation"
import ApiClient from "../libs/ApiClient"
import Color from "../libs/Color"

interface State {
  amount: number
  name: string
  amountTextPosition: number
}
interface Props {
  navigation: NavigationScreenProp<any>
}

export default class MainScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      amount: 0,
      name: "燃えるごみ",
      amountTextPosition: 0,
    }
  }

  async componentDidMount() {
    try {
      setInterval(async () => {
        const amount = await ApiClient.getAmount()
        this.setState({
          amount,
        })
      }, 1000)
    } catch (err) {
      Alert.alert("通信に失敗しました。時間をおいてもう一度お試しください。")
    }
  }

  render() {
    let img_dustbox
    switch (this.state.amount) {
      case 0:
        img_dustbox = require("../assets/dustbox.png")
        break
      case 1:
        img_dustbox = require("../assets/dustbox_20.png")
        break
      case 2:
        img_dustbox = require("../assets/dustbox_40.png")
        break
      case 3:
        img_dustbox = require("../assets/dustbox_60.png")
        break
      case 4:
        img_dustbox = require("../assets/dustbox_80.png")
        break
      case 5:
        img_dustbox = require("../assets/dustbox_100.png")
        break
      default:
        img_dustbox = require("../assets/dustbox.png")
        break
    }
    return (
      <Container>
        <Content style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{this.state.name}</Text>
          </View>
          <View
            style={{ flex: 3 }}
            onLayout={event => {
              this.setState({
                amountTextPosition: event.nativeEvent.layout.height / 2,
              })
            }}
          >
            <Image source={img_dustbox} style={imgStyles.dustBoxImg} />
            <Text
              style={[
                styles.amountText,
                { marginTop: this.state.amountTextPosition },
              ]}
            >
              {this.state.amount * 20 + "%"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              transparent
              large
              onPress={() => {
                this.props.navigation.navigate("Setting")
              }}
              success
              style={{ marginTop: 40, alignSelf: "center", height: 100 }}
            >
              <Icon name="settings" style={{ fontSize: 100 }} />
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}

interface ImgStyles {
  dustBoxImg: ImageStyle
}

const imgStyles = StyleSheet.create<ImgStyles>({
  dustBoxImg: {
    flex: 1,
    width: undefined,
    height: undefined,
    tintColor: Color.main,
    resizeMode: "contain",
  },
})

const styles = StyleSheet.create({
  nameText: {
    color: Color.main,
    alignSelf: "center",
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 30,
  },
  amountText: {
    color: Color.secandary,
    position: "absolute",
    alignSelf: "center",
    marginTop: 0,
    fontSize: 60,
    fontWeight: "bold",
  },
})
