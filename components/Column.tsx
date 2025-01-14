import { Droppable } from '@hello-pangea/dnd'
import Task from './Task'
import { Column as ColumnType, Task as TaskType } from '../store/boardSlice'

interface ColumnProps {
  column: ColumnType
  tasks: TaskType[]
}

export default function Column({ column, tasks }: ColumnProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[calc(100vh-12rem)] flex flex-col">
      <h2 className="font-bold mb-4 text-lg text-gray-700">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-1 overflow-y-auto min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
