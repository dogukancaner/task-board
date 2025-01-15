'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import TaskForm from './TaskForm'

export default function AddTaskButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="font-bold">
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill in the details below to create a new task
          </DialogDescription>
        </DialogHeader>
        <TaskForm onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
