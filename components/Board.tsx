'use client'

import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { moveTask } from '../store/boardSlice'
import Column from './Column'

export default function Board() {
  // Board'ı redux store'dan al
  const board = useSelector((state: RootState) => state.board)
  // Dispatch fonksiyonunu al
  const dispatch = useDispatch()

  // Taşıma işlemini gerçekleştiren fonksiyon
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Eğer hedef sütun yoksa işlem yapılmaz
    if (!destination) {
      return
    }

    // Aynı sütunda aynı index'e bırakılırsa işlem yapılmaz ve state güncellenmez
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Görev taşıma işlemi gerçekleştirilir
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
          // İd'siyle column'u al
          const column = board.columns[columnId]
          // Column'daki task'leri id'ye göre al
          const tasks = column.taskIds.map((taskId) => board.tasks[taskId])
          // id'siyle key olarak Column'u render et
          return <Column key={column.id} column={column} tasks={tasks} />
        })}
      </div>
    </DragDropContext>
  )
}
