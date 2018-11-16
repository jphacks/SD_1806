import React from "react"
import { StyleSheet, Dimensions, Image, ImageStyle } from "react-native"
import { Container, Content, Button, Icon, Text, View, Col } from "native-base"
import { NavigationScreenProp } from "react-navigation"
import ApiClient from "../libs/ApiClient"
import Color from "../libs/Color"
import { LineChart } from "react-native-chart-kit"

interface State {}
interface Props {
  name: string
  navigation: NavigationScreenProp<any>
}

const screenWidth = Dimensions.get("window").width
const data = {
  labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
}
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => Color.main,
  style: {
    borderRadius: 16,
  },
}

export default class ChartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    try {
    } catch (err) {}
  }

  render() {
    return (
      <Container>
        <Content
          style={{ flex: 1, marginBottom: 50 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={{ flex: 2, margin: 5 }}>
            <View style={styles.frameView}>
              <View style={{ flex: 0, alignItems: "center" }}>
                <Text style={styles.mainText}>今月のゴミの量</Text>
              </View>
              <View style={{ flex: 1, paddingVertical: 10 }}>
                <Image
                  source={require("../assets/gomi_black.png")}
                  style={imgStyles.dustImg}
                />
                <Text style={styles.amountText}>50L</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <View style={styles.frameView}>
              <View style={{ flex: 0 }}>
                <Text style={styles.mainText}>月別レポート</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LineChart
                  data={data}
                  width={screenWidth - 30}
                  height={220}
                  chartConfig={chartConfig}
                />
              </View>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

interface ImgStyles {
  dustImg: ImageStyle
}

const imgStyles = StyleSheet.create<ImgStyles>({
  dustImg: {
    flex: 1,
    width: undefined,
    height: undefined,
    tintColor: Color.main,
    resizeMode: "contain",
  },
})

const styles = StyleSheet.create({
  mainText: {
    color: Color.text,
    fontSize: 25,
    alignSelf: "center",
    fontWeight: "bold",
  },
  secandaryText: {
    color: Color.textSecandary,
    lineHeight: 25,
    fontSize: 18,
    marginTop: 10,
  },
  amountText: {
    color: "#fff",
    position: "absolute",
    alignSelf: "center",
    marginTop: 80,
    fontSize: 60,
    fontWeight: "bold",
  },
  frameView: {
    flex: 1,
    borderColor: Color.border,
    borderWidth: 5,
    borderRadius: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
})
