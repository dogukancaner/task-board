'use client'

import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { moveTask } from '../store/boardSlice'
import Column from './Column'

export default function Board() {
  const board = useSelector((state: RootState) => state.board)
  const dispatch = useDispatch()

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    dispatch(
      moveTask({
        taskId: draggableId,
        source: source.droppableId,
        destination: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId]
          const tasks = column.taskIds.map((taskId) => board.tasks[taskId])

          return <Column key={column.id} column={column} tasks={tasks} />
        })}
      </div>
    </DragDropContext>
  )
}
