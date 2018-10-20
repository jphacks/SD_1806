const API_ROOT = "http://127.0.0.1:5000/"

export default class ApiClient {
  //   static async postConfig(ku: string, kana1: string, kana2: string, ): Promise<void> {}

  static async getAmount(): Promise<number> {
    const url: string = API_ROOT + "amount"
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET amount."
    const jsonData = await response.json()
    return jsonData.amount
  }

  static async postConfig(ku: string, kn1: string, kn2: string): Promise<void> {
    const url: string = API_ROOT + "config"
    const fd = new FormData()
    fd.append("ku", ku)
    fd.append("kana1", kn1)
    fd.append("kana2", kn2)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: fd,
    })
    if (!response.ok) throw "Failed to POST config."
  }

  static async postConfigID(id: string): Promise<void> {
    const url: string = API_ROOT + "config"
    const fd = new FormData()
    fd.append("id", id)
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
    return jsonData
  }
}
