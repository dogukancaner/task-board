'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, updateTask, User } from '../store/boardSlice'
import { RootState } from '../store/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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
    if (taskId) {
      dispatch(updateTask({ id: taskId, updates: taskData }))
    } else {
      dispatch(addTask(taskData))
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="assignee">Assignee</Label>
        <Select
          value={assignee?.id || ''}
          onValueChange={(value) =>
            setAssignee(users.find((user) => user.id === value) || null)
          }
        >
          <SelectTrigger id="assignee">
            <SelectValue placeholder="Assign to" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="storyPoints">Story Points</Label>
        <Input
          id="storyPoints"
          type="number"
          placeholder="Story Points"
          value={storyPoints}
          onChange={(e) => setStoryPoints(e.target.value)}
        />
      </div>
      <div>
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{taskId ? 'Update Task' : 'Add Task'}</Button>
      </div>
    </form>
  )
}
