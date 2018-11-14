import DayOfWeek from "../libs/DayOfWeek"

export default interface Setting {
  name: string
  garbageDay: DayOfWeek
  notificationDay: DayOfWeek
  notificationTime: number
  notificationSound: boolean
}
