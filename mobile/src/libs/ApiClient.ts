const API_ROOT = "https://jonghelper.com/gomi/"

export default class ApiClient {
  //   static async postConfig(ku: string, kana1: string, kana2: string, ): Promise<void> {}

  static async getAmount(): Promise<number> {
    const url: string = API_ROOT + "amount"
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET amount."
    const jsonData = await response.json()
    return jsonData.amount
  }

  static async postConfigID(id: string): Promise<void> {
    const url: string = API_ROOT + "config"
    const fd = new FormData()
    fd.append("collection", id)
    fd.append("name", "燃えるごみ")
    fd.append("category", "katei")
    fd.append("notify_for_today", "1")
    fd.append("notify_for_tomorrow", "1")
    fd.append("notification_time_for_today", "07:00")
    fd.append("notification_time_for_tomorrow", "19:00")

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
}
