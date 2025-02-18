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
import {
  CalendarIcon,
  ClipboardListIcon,
  UserIcon,
  HashIcon,
  AlignLeftIcon,
} from 'lucide-react'
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
import { calendarStyles } from '@/styles/calendarStyles'

interface TaskFormProps {
  taskId?: string
  onClose: () => void
}

export default function TaskForm({ taskId, onClose }: TaskFormProps) {
  const dispatch = useDispatch()
  // Redux store'dan users'ı al
  const users = useSelector((state: RootState) => state.board.users)
  // Eğer taskId varsa, o task'i al, yoksa null dön
  const existingTask = useSelector((state: RootState) =>
    taskId ? state.board.tasks[taskId] : null
  )

  // Task title'ını oluştur
  const [title, setTitle] = useState(existingTask?.title || '')
  // Eğer taskId varsa, o task'in description'ını al, yoksa boş string dön
  const [description, setDescription] = useState(
    existingTask?.description || ''
  )
  // Eğer taskId varsa, o task'in assignee'sini al, yoksa users[0] dön
  const [assignee, setAssignee] = useState<User>(() => {
    return existingTask?.assignee && users.includes(existingTask.assignee)
      ? existingTask.assignee
      : users[0]
  })
  // Eğer taskId varsa, o task'in storyPoints'ını al, yoksa 0 dön
  const [storyPoints, setStoryPoints] = useState(
    existingTask?.storyPoints?.toString() || '0'
  )
  // Eğer taskId varsa, o task'in startDate'sini al, yoksa bugünün tarihini dön
  const [startDate, setStartDate] = useState<Date>(
    existingTask?.startDate ? new Date(existingTask.startDate) : new Date()
  )
  // Eğer taskId varsa, o task'in endDate'sini al, yoksa bugünün tarihini 1 gün artırarak dön
  const [endDate, setEndDate] = useState<Date>(
    existingTask?.endDate
      ? new Date(existingTask.endDate)
      : new Date(new Date().setDate(new Date().getDate() + 1))
  )
  // Start date'i açmak için state
  const [startDateOpen, setStartDateOpen] = useState(false)
  // End date'i açmak için state
  const [endDateOpen, setEndDateOpen] = useState(false)
  // Start date'i açmak için dialog'ı açmak için state
  const [isStartDateDialogOpen, setIsStartDateDialogOpen] = useState(false)
  // End date'i açmak için dialog'ı açmak için state
  const [isEndDateDialogOpen, setIsEndDateDialogOpen] = useState(false)

  // Form gönderildiğinde çalışır
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Task verilerini oluştur
    const taskData = {
      title,
      description,
      assignee,
      storyPoints: parseInt(storyPoints),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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
    if (date) {
      setStartDate(date)
      setStartDateOpen(false)
    }
  }

  // Bitiş tarihi seçildiğinde çalışır
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
      setEndDateOpen(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
        >
          <ClipboardListIcon className="h-4 w-4" />
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
          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
        >
          <AlignLeftIcon className="h-4 w-4" />
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
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <UserIcon className="h-4 w-4" />
            Assignee
          </Label>
          <Select
            value={assignee?.id || ''}
            onValueChange={(value) => {
              const selectedUser = users.find((user) => user.id === value)
              setAssignee(selectedUser || users[0])
            }}
          >
            <SelectTrigger
              id="assignee"
              className="w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <SelectValue placeholder="Select team member">
                {/* Eğer assignee varsa, onu render et */}
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
              {/* Tüm kullanıcıları render et */}
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
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <HashIcon className="h-4 w-4" />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
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
                  {startDate ? format(startDate, 'PP') : 'Select Start Date'}
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
                  className="mx-auto border border-gray-200 rounded-lg"
                  classNames={calendarStyles}
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
              {startDate ? format(startDate, 'PP') : 'Select Start Date'}
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
                    className="mx-auto border border-gray-200 rounded-lg"
                    classNames={calendarStyles}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
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
                  {endDate ? format(endDate, 'PP') : 'Select End Date'}
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
                    setIsEndDateDialogOpen(false)
                  }}
                  initialFocus
                  className="mx-auto border border-gray-200 rounded-lg"
                  classNames={calendarStyles}
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
              {endDate ? format(endDate, 'PP') : 'Select End Date'}
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
                    className="mx-auto border border-gray-200 rounded-lg"
                    classNames={calendarStyles}
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
