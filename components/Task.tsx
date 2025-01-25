import { Draggable } from '@hello-pangea/dnd'
import { Task as TaskType } from '../store/boardSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, LayersIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TaskForm from './TaskForm'

interface TaskProps {
  task: TaskType
  index: number
}

export default function Task({ task, index }: TaskProps) {
  // Task'in açılıp açılmadığını kontrol etmek için state
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Tarih formatlayıcı fonksiyonu
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy')
    } catch {
      return ''
    }
  }

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="mb-3 hover:shadow-lg transition-shadow group cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                {task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed font-normal">
                {task.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <LayersIcon className="w-3 h-3" />
                  {task.storyPoints} SP
                </Badge>
                {task.endDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {formatDate(task.endDate)}
                  </Badge>
                )}
              </div>

              {task.assignee && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                    />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {task.assignee.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {task.assignee.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.assignee.role}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Draggable>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Task Details
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              View or edit task details below
            </DialogDescription>
          </DialogHeader>
          <TaskForm taskId={task.id} onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
