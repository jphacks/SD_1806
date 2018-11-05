import Category from "../libs/Category"

export default interface Setting {
  collection: string
  name: string
  category: Category
  notify_for_today: boolean // 0 or 1
  notify_for_tomorrow: boolean // 0 or 1
  notification_time_for_today: string // 07:00
  notification_time_for_tomorrow: string // 19:00
}
