"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"
import { zhCN } from "date-fns/locale"

interface CalendarProps {
  events: CalendarEvent[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onEditEvent: (event: CalendarEvent) => void
  viewMode: "day" | "week"
}

export function Calendar({ events, selectedDate, onSelectDate, onEditEvent, viewMode }: CalendarProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDateTime = (date: Date, hour: number) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return events.filter((event) => {
      const eventHour = Number.parseInt(event.time.split(":")[0])

      // Check if event matches this date and hour
      if (event.date === dateStr && eventHour === hour) {
        return true
      }

      // Check recurrence
      if (event.recurrence === "daily" && eventHour === hour) {
        return true
      }

      if (event.recurrence === "weekly" && eventHour === hour) {
        const eventDate = new Date(event.date)
        return eventDate.getDay() === date.getDay()
      }

      return false
    })
  }

  const handlePrevious = () => {
    if (viewMode === "week") {
      onSelectDate(subWeeks(selectedDate, 1))
    } else {
      onSelectDate(addDays(selectedDate, -1))
    }
  }

  const handleNext = () => {
    if (viewMode === "week") {
      onSelectDate(addWeeks(selectedDate, 1))
    } else {
      onSelectDate(addDays(selectedDate, 1))
    }
  }

  const daysToShow = viewMode === "week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [selectedDate]

  return (
    <Card className="overflow-hidden border-0 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {viewMode === "week"
              ? `${format(weekStart, "M月d日", { locale: zhCN })} - ${format(addDays(weekStart, 6), "M月d日", { locale: zhCN })}`
              : format(selectedDate, "M月d日 EEEE", { locale: zhCN })}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrevious} className="text-white hover:bg-white/20">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} className="text-white hover:bg-white/20">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${daysToShow.length}, 1fr)` }}>
          {/* Header Row */}
          <div className="sticky top-0 z-10 border-b border-r bg-gray-50 p-3" />
          {daysToShow.map((day) => (
            <div
              key={day.toISOString()}
              className={`sticky top-0 z-10 border-b border-r bg-gray-50 p-3 text-center ${
                isSameDay(day, new Date()) ? "bg-indigo-50" : ""
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">{format(day, "EEE", { locale: zhCN })}</div>
              <div
                className={`mt-1 text-2xl font-bold ${
                  isSameDay(day, new Date()) ? "text-indigo-600" : "text-gray-700"
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}

          {/* Time Rows */}
          {hours.map((hour) => (
            <>
              <div
                key={`time-${hour}`}
                className="border-b border-r bg-gray-50 p-2 text-right text-sm font-medium text-gray-600"
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
              {daysToShow.map((day) => {
                const cellEvents = getEventsForDateTime(day, hour)
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="relative min-h-[60px] border-b border-r p-1 hover:bg-gray-50"
                  >
                    {cellEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onEditEvent(event)}
                        className="mb-1 w-full rounded-md p-2 text-left text-xs transition-all hover:shadow-md"
                        style={{
                          backgroundColor: event.color || "#6366f1",
                          color: "white",
                        }}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="mt-1 text-[10px] opacity-90">
                          {event.time} ({event.duration}分钟)
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </Card>
  )
}
