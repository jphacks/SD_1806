import Setting from "../interface/Setting"

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
    console.log(jsonData)
    return jsonData[0].amount
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
    fd.append("notification", "t")
    // fd.append("nth", "1,3")
    fd.append("weekday", setting.notificationDay.toString())

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: fd,
    })
    if (!response.ok) throw "Failed to POST config."
  }

  static async getCollection(
    ku: string,
    kn1: string,
    kn2: string
  ): Promise<any> {
    const url: string =
      API_ROOT + `collection?ku=${ku}&kana1=${kn1}&kana2=${kn2}`
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET collection."
    const jsonData = await response.json()
    console.log(jsonData)
    return jsonData
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
