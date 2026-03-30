import type { StoreId } from "@/lib/data"

type StoreHours = {
  startHour: number
  endHour: number
}

const STORE_HOURS: Record<StoreId, StoreHours> = {
  inside: { startHour: 12, endHour: 21 },
  outside: { startHour: 13, endHour: 23 },
}

export function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`
}

export function getStoreTimingLabel(store: StoreId) {
  const schedule = STORE_HOURS[store]
  return `${formatHour(schedule.startHour)} - ${formatHour(schedule.endHour)}`
}

export function isStoreOpen(store: StoreId, date = new Date()) {
  const currentHour = date.getHours()
  const schedule = STORE_HOURS[store]
  return currentHour >= schedule.startHour && currentHour < schedule.endHour
}

export function getStoreClosedMessage(store: StoreId) {
  return `Shop is closed. Open daily ${getStoreTimingLabel(store)}.`
}
