"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trash2, Edit, Repeat } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface EventListProps {
  events: CalendarEvent[]
  selectedDate: Date
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (id: string) => void
}

export function EventList({ events, selectedDate, onEditEvent, onDeleteEvent }: EventListProps) {
  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return events
      .filter((event) => {
        if (event.date === dateStr) return true
        if (event.recurrence === "daily") return true
        if (event.recurrence === "weekly") {
          const eventDate = new Date(event.date)
          return eventDate.getDay() === date.getDay()
        }
        return false
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const todayEvents = getEventsForDate(selectedDate)

  const getRecurrenceText = (type: string) => {
    switch (type) {
      case "daily":
        return "每天"
      case "weekly":
        return "每周"
      default:
        return "单次"
    }
  }

  return (
    <Card className="overflow-hidden border-0 bg-white shadow-lg">
      <div className="border-b bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">{format(selectedDate, "M月d日", { locale: zhCN })} 的事件</h3>
        <p className="mt-1 text-sm text-purple-100">共 {todayEvents.length} 个事件</p>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-4">
        {todayEvents.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">这天没有安排事件</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: event.color || "#6366f1" }} />
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    </div>
                    {event.description && <p className="mt-2 text-sm text-gray-600">{event.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Repeat className="h-3 w-3" />
                    {getRecurrenceText(event.recurrence)}
                  </Badge>
                  <span>{event.duration}分钟</span>
                </div>

                <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" variant="outline" onClick={() => onEditEvent(event)} className="gap-1">
                    <Edit className="h-3 w-3" />
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteEvent(event.id)}
                    className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
