import Setting from "../interface/Setting"
import { iid } from "react-native-firebase"
import { daysOfWeekToBool, nthWeekToBool } from "../libs/Module"

const API_ROOT = "https://sugoigomibako.herokuapp.com/"

export default class ApiClient {
  //   static async postConfig(ku: string, kana1: string, kana2: string, ): Promise<void> {}

  static async getAmount(): Promise<number> {
    const url: string = API_ROOT + "amount"
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET amount."
    const jsonData = await response.json()
    return jsonData[0].amount
  }

  static async getAmountTotal(): Promise<number> {
    const url: string = API_ROOT + "amount/total"
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET total amount."
    const jsonData = await response.json()
    // console.log(jsonData)
    return jsonData[0].total
  }

  static async getAmountLog(n: number): Promise<any> {
    const url: string = API_ROOT + `amount/total?limit=${n}`
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET amount log."
    const jsonData = await response.json()
    console.log(jsonData)
    return jsonData
  }

  static async getSmell(): Promise<number> {
    const url: string = API_ROOT + "smell"
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET smell."
    const jsonData = await response.json()
    return jsonData[0].smell
  }

  static async postConfig(setting: Setting): Promise<void> {
    const url: string = API_ROOT + "config"
    const fd = new FormData()
    fd.append("name", setting.name)
    fd.append("notification", setting.notification ? "t" : "")
    fd.append("time", setting.notificationTime + ":00")
    let weekday = ""
    for (let i = 0; i < setting.garbageDays.length; i++) {
      if (setting.garbageDays[i]) weekday += i
    }
    fd.append("weekday", weekday)
    let nth = ""
    for (let i = 0; i < setting.nthWeeks.length; i++) {
      if (setting.nthWeeks[i]) nth += i + 1
    }
    fd.append("nth", nth)

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: fd,
    })
    if (!response.ok) throw "Failed to POST config."
  }

  static async getCollection(
    wardID: number,
    kn1: string,
    kn2: string
  ): Promise<any> {
    const url: string =
      API_ROOT + `collection/search?ku_id=${wardID}&kana1=${kn1}&kana2=${kn2}`
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET collection."
    const jsonData = await response.json()
    console.log(jsonData)
    return jsonData
  }

  static async getCollectionDay(
    id: number,
    categoryId: number
  ): Promise<{ nth: boolean[]; weekday: boolean[] }> {
    const url: string =
      API_ROOT + `collection?id=${id}&sorting_id=${categoryId}`
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET collection."
    const jsonData = await response.json()
    console.log(jsonData)
    return {
      nth: nthWeekToBool(jsonData.nth),
      weekday: daysOfWeekToBool(jsonData.weekday),
    }
  }

  static async setToken(token: string) {
    const url: string = "https://sugoigomibako.herokuapp.com/token"
    const fd = new FormData()
    fd.append("token", token)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: fd,
    })
    if (!response.ok) throw "Failed to POST config."
  }
}
