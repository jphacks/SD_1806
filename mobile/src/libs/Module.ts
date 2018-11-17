import DayOfWeek from "./DayOfWeek"

const weekDayStringList = ["月", "火", "水", "木", "金", "土", "日"]

function dayOfWeekToString(day: DayOfWeek): string {
  return weekDayStringList[day] + "曜日"
}

function daysOfWeekToString(days: boolean[]): string {
  let res = ""
  for (let i = 0; i < days.length; i++) {
    if (days[i]) {
      if (res.length != 0) res += ","
      res += weekDayStringList[i]
    }
  }
  return res
}

function nthWeekToString(nth: boolean[]): string {
  let res = ""
  for (let i = 0; i < nth.length; i++) {
    if (nth[i]) {
      if (res.length == 0) res = "第"
      else res += ","
      res += i + 1
    }
  }
  if (res) res += "週 "
  if (nth.every(x => x)) res = "毎週 "

  return res
}

export { dayOfWeekToString, daysOfWeekToString, nthWeekToString }
