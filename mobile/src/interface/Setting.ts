import DayOfWeek from "../libs/DayOfWeek"
import { notifications } from "react-native-firebase"

export default interface Setting {
  name: string
  garbageDays: boolean[]
  nthWeeks: boolean[]
  notification: boolean
  notificationTime: string
}
