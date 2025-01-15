import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  name: string
  avatar: string
  role: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: User | null
  status: 'Open' | 'In Progress' | 'In Review' | 'Done'
  storyPoints: number
  startDate: string | null
  endDate: string | null
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}

interface BoardState {
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: string[]
  users: User[]
}

const initialState: BoardState = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Login Sayfası Tasarımı',
      description:
        'Next.js ve Tailwind CSS kullanarak modern bir login sayfası tasarlanacak',
      assignee: {
        id: 'user-1',
        name: 'Doğukan Caner',
        avatar: 'https://github.com/shadcn.png',
        role: 'Frontend Developer',
      },
      status: 'Open',
      storyPoints: 5,
      startDate: '2024-03-20',
      endDate: '2024-03-25',
    },
    'task-2': {
      id: 'task-2',
      title: 'API Entegrasyonu',
      description:
        'Redux Toolkit Query ile backend servislerinin entegrasyonu yapılacak',
      assignee: {
        id: 'user-2',
        name: 'Ali Caner',
        avatar: 'https://github.com/shadcn.png',
        role: 'Frontend Developer',
      },
      status: 'Open',
      storyPoints: 8,
      startDate: '2024-03-22',
      endDate: '2024-03-28',
    },
    'task-3': {
      id: 'task-3',
      title: 'Performans İyileştirmesi',
      description:
        'Sayfa yüklenme hızını artırmak için kod optimizasyonu ve lazy loading implementasyonu',
      assignee: {
        id: 'user-3',
        name: 'Mehmet Caner',
        avatar: 'https://github.com/shadcn.png',
        role: 'Frontend Developer',
      },
      status: 'In Progress',
      storyPoints: 13,
      startDate: '2024-03-18',
      endDate: '2024-03-30',
    },
    'task-4': {
      id: 'task-4',
      title: 'Responsive Tasarım',
      description: 'Tüm sayfaların mobil uyumlu hale getirilmesi',
      assignee: {
        id: 'user-1',
        name: 'Doğukan Caner',
        avatar: 'https://github.com/shadcn.png',
        role: 'Frontend Developer',
      },
      status: 'Done',
      storyPoints: 5,
      startDate: '2024-03-15',
      endDate: '2024-03-18',
    },
    'task-5': {
      id: 'task-5',
      title: 'Test Yazımı',
      description:
        'Jest ve React Testing Library ile birim testlerinin yazılması',
      assignee: {
        id: 'user-2',
        name: 'Ali Caner',
        avatar: 'https://github.com/shadcn.png',
        role: 'Frontend Developer',
      },
      status: 'Done',
      storyPoints: 8,
      startDate: '2024-03-10',
      endDate: '2024-03-15',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Open',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'In Review',
      taskIds: [],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: ['task-4', 'task-5'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  users: [
    {
      id: 'user-1',
      name: 'Doğukan Caner',
      avatar: 'https://github.com/shadcn.png',
      role: 'Frontend Developer',
    },
    {
      id: 'user-2',
      name: 'Ali Caner',
      avatar: 'https://github.com/shadcn.png',
      role: 'Frontend Developer',
    },
    {
      id: 'user-3',
      name: 'Mehmet Caner',
      avatar: 'https://github.com/shadcn.png',
      role: 'Frontend Developer',
    },
  ],
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string
        source: string
        destination: string
        sourceIndex: number
        destinationIndex: number
      }>
    ) => {
      const { taskId, source, destination, sourceIndex, destinationIndex } =
        action.payload

      const sourceTaskIds = [...state.columns[source].taskIds]
      sourceTaskIds.splice(sourceIndex, 1)

      const destinationTaskIds = [...state.columns[destination].taskIds]
      destinationTaskIds.splice(destinationIndex, 0, taskId)

      state.columns[source].taskIds = sourceTaskIds
      state.columns[destination].taskIds = destinationTaskIds

      state.tasks[taskId].status = state.columns[destination]
        .title as Task['status']
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
      const id = uuidv4()
      state.tasks[id] = { ...action.payload, id }
      state.columns['column-1'].taskIds.push(id)
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const { id, updates } = action.payload
      state.tasks[id] = { ...state.tasks[id], ...updates }
    },
  },
})

export const { moveTask, addTask, updateTask } = boardSlice.actions
export default boardSlice.reducer
