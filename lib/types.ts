export type RecurrenceType = "none" | "daily" | "weekly"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string // ISO date string
  time: string // HH:mm format
  duration: number // in minutes
  recurrence: RecurrenceType
  color?: string
}
