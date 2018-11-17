import React from "react"
import {
  Image,
  ImageStyle,
  StyleSheet,
  Alert,
  AsyncStorage,
} from "react-native"
import { Container, Content, Button, Icon, Text, View, Col } from "native-base"
import { NavigationScreenProp } from "react-navigation"
import ApiClient from "../libs/ApiClient"
import Color from "../libs/Color"
import DayOfWeek from "../libs/DayOfWeek"
import Swiper from "react-native-swiper"
import SmellScreen from "../screens/SmellScreen"
import ChartScreen from "../screens/ChartScreen"

interface State {
  amount: number
  name: string
  day: DayOfWeek
}
interface Props {
  navigation: NavigationScreenProp<any>
}

const dustBoxImages = [
  require("../assets/dustbox.png"),
  require("../assets/dustbox_20.png"),
  require("../assets/dustbox_40.png"),
  require("../assets/dustbox_60.png"),
  require("../assets/dustbox_80.png"),
  require("../assets/dustbox_100.png"),
]

export default class MainScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      amount: 0,
      name: "",
      day: DayOfWeek.none,
    }
  }

  async componentDidMount() {
    setInterval(async () => {
      try {
        const amount = await ApiClient.getAmount()
        this.setState({
          amount,
        })
      } catch (err) {
        this.setState({
          amount: 0,
        })
      }
    }, 1000)
    let name = await AsyncStorage.getItem("name")
    let day = await AsyncStorage.getItem("day")
    if (name === null) name = "未設定"
    if (day === null) day = DayOfWeek.none.toString()
    this.setState({
      name: name,
      day: parseInt(day),
    })
  }

  changeSetting = async () => {
    try {
      let name = await AsyncStorage.getItem("name")
      let day = await AsyncStorage.getItem("day")
      if (name === null) name = "未設定"
      if (day === null) day = DayOfWeek.none.toString()
      this.setState({
        name: name,
        day: parseInt(day),
      })
    } catch (err) {
      Alert.alert("通信に失敗しました。時間をおいてもう一度お試しください。")
    }
  }

  render() {
    return (
      <Swiper
        index={1}
        loop={false}
        showsButtons={false}
        showsPagination={true}
        activeDotColor={Color.main}
      >
        <SmellScreen
          navigation={this.props.navigation}
          name={this.state.name}
        />
        <Container>
          <Content
            style={{ flex: 1, marginBottom: 50 }}
            contentContainerStyle={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>{this.state.name}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Image
                source={dustBoxImages[this.state.amount]}
                style={imgStyles.dustBoxImg}
              />
              <Text style={[styles.amountText, { marginTop: 180 }]}>
                {this.state.amount * 20 + "%"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                transparent
                large
                onPress={() => {
                  this.props.navigation.navigate("Setting", {
                    changeSetting: this.changeSetting,
                  })
                }}
                success
                style={{ marginTop: 40, alignSelf: "center", height: 100 }}
              >
                <Icon name="settings" style={{ fontSize: 100 }} />
              </Button>
            </View>
          </Content>
        </Container>
        <ChartScreen
          navigation={this.props.navigation}
          name={this.state.name}
        />
      </Swiper>
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
