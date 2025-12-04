"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarEvent, RecurrenceType } from "@/lib/types"
import { format } from "date-fns"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: CalendarEvent | Omit<CalendarEvent, "id">) => void
  onDelete?: (id: string) => void
  event?: CalendarEvent | null
  selectedDate: Date
}

const colorOptions = [
  { value: "#6366f1", label: "靛蓝" },
  { value: "#8b5cf6", label: "紫色" },
  { value: "#ec4899", label: "粉红" },
  { value: "#f59e0b", label: "橙色" },
  { value: "#10b981", label: "绿色" },
  { value: "#3b82f6", label: "蓝色" },
  { value: "#ef4444", label: "红色" },
]

export function EventDialog({ isOpen, onClose, onSave, onDelete, event, selectedDate }: EventDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(selectedDate, "yyyy-MM-dd"),
    time: "09:00",
    duration: 60,
    recurrence: "none" as RecurrenceType,
    color: "#6366f1",
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.time,
        duration: event.duration,
        recurrence: event.recurrence,
        color: event.color || "#6366f1",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        date: format(selectedDate, "yyyy-MM-dd"),
        time: "09:00",
        duration: 60,
        recurrence: "none",
        color: "#6366f1",
      })
    }
  }, [event, selectedDate, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (event) {
      onSave({ ...formData, id: event.id })
    } else {
      onSave(formData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event ? "编辑事件" : "新建事件"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="输入事件标题"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="添加事件描述（可选）"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">日期 *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">时间 *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">时长（分钟）*</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                step="5"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence">重复</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value: RecurrenceType) => setFormData({ ...formData, recurrence: value })}
              >
                <SelectTrigger id="recurrence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">不重复</SelectItem>
                  <SelectItem value="daily">每天</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>颜色</Label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: option.value })}
                  className={`h-10 w-10 rounded-full transition-all hover:scale-110 ${
                    formData.color === option.value ? "ring-2 ring-gray-900 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            {event && onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(event.id)}
                className="mr-auto text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                删除
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
