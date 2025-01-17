'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, updateTask, User } from '../../store/boardSlice'
import { RootState } from '../../store/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DatePicker } from './DatePicker'

interface TaskFormProps {
  taskId?: string
  onClose: () => void
}

export default function TaskForm({ taskId, onClose }: TaskFormProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.board.users)
  const existingTask = useSelector((state: RootState) =>
    taskId ? state.board.tasks[taskId] : null
  )

  // Form state
  const [title, setTitle] = useState(existingTask?.title || '')
  const [description, setDescription] = useState(
    existingTask?.description || ''
  )
  const [assignee, setAssignee] = useState<User | null>(
    existingTask?.assignee || null
  )
  const [storyPoints, setStoryPoints] = useState(
    existingTask?.storyPoints.toString() || ''
  )
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingTask?.startDate ? new Date(existingTask.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    existingTask?.endDate ? new Date(existingTask.endDate) : undefined
  )

  // Date picker state
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const taskData = {
      title,
      description,
      assignee,
      storyPoints: parseInt(storyPoints),
      startDate: startDate?.toISOString() || null,
      endDate: endDate?.toISOString() || null,
      status: existingTask?.status || 'Open',
    }

    // Görevin id'sine göre güncelleme veya ekleme işlemi yapılır
    if (taskId) {
      dispatch(updateTask({ id: taskId, updates: taskData }))
    } else {
      dispatch(addTask(taskData))
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assignee Select */}
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            value={assignee?.id || ''}
            onValueChange={(value) =>
              setAssignee(users.find((user) => user.id === value) || null)
            }
          >
            <SelectTrigger id="assignee">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storyPoints">Story Points</Label>
          <Input
            id="storyPoints"
            type="number"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            min="0"
            required
          />
        </div>

        <DatePicker
          label="Start Date"
          date={startDate}
          onSelect={setStartDate}
          isOpen={startDateOpen}
          onOpenChange={setStartDateOpen}
        />

        <DatePicker
          label="End Date"
          date={endDate}
          onSelect={setEndDate}
          isOpen={endDateOpen}
          onOpenChange={setEndDateOpen}
          minDate={startDate}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">{taskId ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </form>
  )
}
