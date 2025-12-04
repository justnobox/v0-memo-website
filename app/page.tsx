"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/calendar"
import { EventList } from "@/components/event-list"
import { EventDialog } from "@/components/event-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("calendar-events")
    if (stored) {
      setEvents(JSON.parse(stored))
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  const handleAddEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    }
    setEvents([...events, newEvent])
    setIsDialogOpen(false)
  }

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
    setEditingEvent(null)
    setIsDialogOpen(false)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
    setEditingEvent(null)
    setIsDialogOpen(false)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  const handleNewEvent = () => {
    setEditingEvent(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">我的备忘录</h1>
            <p className="mt-2 text-lg text-gray-600">管理你的日程安排和重要事项</p>
          </div>
          <Button onClick={handleNewEvent} size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-5 w-5" />
            新建事件
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            onClick={() => setViewMode("day")}
            className={viewMode === "day" ? "bg-indigo-600" : ""}
          >
            日视图
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            onClick={() => setViewMode("week")}
            className={viewMode === "week" ? "bg-indigo-600" : ""}
          >
            周视图
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onEditEvent={handleEditEvent}
              viewMode={viewMode}
            />
          </div>

          {/* Event List */}
          <div className="lg:col-span-1">
            <EventList
              events={events}
              selectedDate={selectedDate}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingEvent(null)
        }}
        onSave={editingEvent ? handleUpdateEvent : handleAddEvent}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  )
}
