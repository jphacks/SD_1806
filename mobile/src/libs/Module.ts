import DayOfWeek from "./DayOfWeek"

function dayOfWeekToString(day: DayOfWeek): string {
  switch (day) {
    case DayOfWeek.Monday:
      return "月曜日"
    case DayOfWeek.Tuesday:
      return "火曜日"
    case DayOfWeek.Wednesday:
      return "水曜日"
    case DayOfWeek.Thursday:
      return "木曜日"
    case DayOfWeek.Friday:
      return "金曜日"
    case DayOfWeek.Saturday:
      return "土曜日"
    case DayOfWeek.Sunday:
      return "日曜日"
    default:
      return "未定義"
  }
}

export { dayOfWeekToString }
