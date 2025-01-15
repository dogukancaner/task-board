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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [isStartDateDialogOpen, setIsStartDateDialogOpen] = useState(false)
  const [isEndDateDialogOpen, setIsEndDateDialogOpen] = useState(false)

  // Form gönderildiğinde çalışır
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
    // Eğer taskId varsa, güncelleme işlemi yapılır, yoksa yeni task eklenir
    if (taskId) {
      dispatch(updateTask({ id: taskId, updates: taskData }))
    } else {
      dispatch(addTask(taskData))
    }
    onClose()
  }

  // Başlangıç tarihi seçildiğinde çalışır
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    setStartDateOpen(false)
  }

  // Bitiş tarihi seçildiğinde çalışır
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
    setEndDateOpen(false)
  }

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ''
    return format(date, 'yyyy-MM-dd')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
          Task Title
        </Label>
        <Input
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-sm font-semibold text-gray-700"
        >
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="assignee"
            className="text-sm font-semibold text-gray-700"
          >
            Assignee
          </Label>
          <Select
            value={assignee?.id || ''}
            onValueChange={(value) =>
              setAssignee(users.find((user) => user.id === value) || null)
            }
          >
            <SelectTrigger
              id="assignee"
              className="w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <SelectValue placeholder="Select team member">
                {assignee && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {assignee.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {assignee.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {assignee.role}
                      </span>
                    </div>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem
                  key={user.id}
                  value={user.id}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="storyPoints"
            className="text-sm font-semibold text-gray-700"
          >
            Story Points
          </Label>
          <Input
            id="storyPoints"
            type="number"
            placeholder="SP"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Start Date
          </Label>
          <div className="hidden sm:block">
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal border border-gray-200 hover:bg-gray-50',
                    !startDate && 'text-gray-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {startDate ? format(startDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[280px] p-0"
                align="center"
                side="bottom"
                sideOffset={8}
                alignOffset={0}
                avoidCollisions={true}
                forceMount
                style={{
                  maxWidth: 'calc(100vw - 32px)',
                  position: 'relative',
                  zIndex: 50,
                }}
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    handleStartDateSelect(date)
                    setStartDateOpen(false)
                  }}
                  initialFocus
                  className="rounded-lg border border-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="block sm:hidden">
            <Button
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal border border-gray-200 hover:bg-gray-50',
                !startDate && 'text-gray-500'
              )}
              onClick={() => setIsStartDateDialogOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {startDate ? format(startDate, 'PPP') : 'Select date'}
            </Button>
            <Dialog
              open={isStartDateDialogOpen}
              onOpenChange={setIsStartDateDialogOpen}
            >
              <DialogContent className="p-0 sm:max-w-[425px] w-[95vw] mx-auto">
                <DialogHeader className="p-4 pb-2 space-y-1">
                  <DialogTitle className="text-lg font-semibold text-center">
                    Select Date
                  </DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      handleStartDateSelect(date)
                      setIsStartDateDialogOpen(false)
                    }}
                    initialFocus
                    className="mx-auto"
                    classNames={{
                      root: 'w-full',
                      months: 'w-full space-y-4',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button:
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex justify-center',
                      head_cell:
                        'text-muted-foreground rounded-md w-9 font-normal text-xs',
                      row: 'flex justify-center mt-2',
                      cell: 'text-center text-sm relative p-0 hover:bg-gray-100 rounded-md',
                      day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md',
                      day_selected:
                        'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
                      day_today: 'bg-gray-100',
                      day_outside: 'opacity-50',
                      day_disabled: 'opacity-50',
                      day_range_middle: 'aria-selected:bg-gray-100',
                      day_hidden: 'invisible',
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            End Date
          </Label>
          <div className="hidden sm:block">
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal border border-gray-200 hover:bg-gray-50',
                    !endDate && 'text-gray-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {endDate ? format(endDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[280px] p-0"
                align="center"
                side="bottom"
                sideOffset={8}
                alignOffset={0}
                avoidCollisions={true}
                forceMount
                style={{
                  maxWidth: 'calc(100vw - 32px)',
                  position: 'relative',
                  zIndex: 50,
                }}
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    handleEndDateSelect(date)
                    setEndDateOpen(false)
                  }}
                  initialFocus
                  className="rounded-lg border border-gray-200"
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="block sm:hidden">
            <Button
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal border border-gray-200 hover:bg-gray-50',
                !endDate && 'text-gray-500'
              )}
              onClick={() => setIsEndDateDialogOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {endDate ? format(endDate, 'PPP') : 'Select date'}
            </Button>
            <Dialog
              open={isEndDateDialogOpen}
              onOpenChange={setIsEndDateDialogOpen}
            >
              <DialogContent className="p-0 sm:max-w-[425px] w-[95vw] mx-auto">
                <DialogHeader className="p-4 pb-2 space-y-1">
                  <DialogTitle className="text-lg font-semibold text-center">
                    Select End Date
                  </DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      handleEndDateSelect(date)
                      setIsEndDateDialogOpen(false)
                    }}
                    initialFocus
                    className="mx-auto"
                    classNames={{
                      root: 'w-full',
                      months: 'w-full space-y-4',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button:
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex justify-center',
                      head_cell:
                        'text-muted-foreground rounded-md w-9 font-normal text-xs',
                      row: 'flex justify-center mt-2',
                      cell: 'text-center text-sm relative p-0 hover:bg-gray-100 rounded-md',
                      day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md',
                      day_selected:
                        'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
                      day_today: 'bg-gray-100',
                      day_outside: 'opacity-50',
                      day_disabled: 'opacity-50',
                      day_range_middle: 'aria-selected:bg-gray-100',
                      day_hidden: 'invisible',
                    }}
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            {taskId ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </form>
  )
}
