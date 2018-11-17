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

function daysOfWeekToBool(days: string): boolean[] {
  let res = new Array<boolean>(7).fill(false)
  console.log("dayOfWeekToBool")
  console.log(days)
  days = days.replace("/,/g", "")
  for (let i = 0; i < days.length; i++) {
    res[parseInt(days[i])] = true
  }
  console.log(res)
  return res
}

function nthWeekToBool(nth: string): boolean[] {
  let res: boolean[]
  console.log("nthWeekToBool")
  console.log(nth)
  nth = nth.replace("/,/g", "")
  if (nth) {
    res = new Array<boolean>(4).fill(false)
    for (let i = 0; i < nth.length; i++) {
      res[parseInt(nth[i]) - 1] = true
    }
  } else {
    res = new Array<boolean>(4).fill(true)
  }
  console.log(res)
  return res
}

export {
  dayOfWeekToString,
  daysOfWeekToString,
  nthWeekToString,
  daysOfWeekToBool,
  nthWeekToBool,
}
