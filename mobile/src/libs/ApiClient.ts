const API_ROOT = "http://127.0.0.1:5000/"

export default class ApiClient {
  //   static async postConfig(ku: string, kana1: string, kana2: string, ): Promise<void> {}

  static async getAmount(): Promise<number> {
    const url: string = API_ROOT + "amount"
    const response = await fetch(url)
    if (!response.ok) throw "Failed to GET recommend."
    const jsonData = await response.json()
    return jsonData.amount
  }
}
