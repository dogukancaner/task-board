import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

// Kullanıcıları temsil eden interface
export interface User {
  id: string
  name: string
  avatar: string
  role: string
}

// Görevleri temsil eden interface
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

// Sütunları temsil eden interface
export interface Column {
  id: string
  title: string
  taskIds: string[]
}

// Board'ı temsil eden interface
interface BoardState {
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: string[]
  users: User[]
}

// Başlangıç durumu
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
    // Görevi taşıma işlemi
    moveTask: (
      state,
      // Taşınacak görevin bilgilerini al
      action: PayloadAction<{
        taskId: string
        source: string
        destination: string
        sourceIndex: number
        destinationIndex: number
      }>
    ) => {
      // Taşınacak görevin id'sini, kaynak ve hedef sütunların id'lerini ve taşınacak görevin sırasını alır
      const { taskId, source, destination, sourceIndex, destinationIndex } =
        action.payload

      // Kaynak ve hedef aynı sütun ise
      if (source === destination) {
        // Kaynak sütununu al
        const column = state.columns[source]
        // Sütunun taskIds'ini al
        const newTaskIds = [...column.taskIds]
        // Taşınan görevi çıkar ve yeni konuma ekle
        newTaskIds.splice(sourceIndex, 1)
        // Taşınan görevi hedef sütunun taskIds'ine ekle
        newTaskIds.splice(destinationIndex, 0, taskId)
        // Sütunu güncelle
        state.columns[source].taskIds = newTaskIds
      } else {
        // Farklı sütunlar arası taşıma
        const sourceTaskIds = [...state.columns[source].taskIds]
        // Hedef sütunun taskIds'ini al
        const destinationTaskIds = [...state.columns[destination].taskIds]

        // Kaynak sütundan görevi çıkar
        sourceTaskIds.splice(sourceIndex, 1)
        // Hedef sütuna görevi ekle
        destinationTaskIds.splice(destinationIndex, 0, taskId)

        // Sütunları güncelle
        state.columns[source].taskIds = sourceTaskIds
        // Hedef sütunu güncelle
        state.columns[destination].taskIds = destinationTaskIds

        // Görevin durumunu güncelle
        state.tasks[taskId].status = state.columns[destination]
          .title as Task['status']
      }
    },
    // Yeni görev ekleme
    addTask: (
      state,
      // Yeni görevin bilgilerini al
      action: PayloadAction<{
        title: string
        description: string
        assignee: User | null
        storyPoints: number
        startDate: string | null
        endDate: string | null
        status: Task['status']
      }>
    ) => {
      // Yeni görevin benzersiz id'sini oluşturur.
      const id = uuidv4()
      // Yeni görevi state'e ekler
      state.tasks[id] = { ...action.payload, id }
      // Yeni görevi Open(column-1) sütununa ekler
      state.columns['column-1'].taskIds.push(id)
    },
    // Görevi güncelleme işlemi
    updateTask: (
      state,
      // Güncellenecek görevin bilgilerini al
      action: PayloadAction<{
        id: string
        updates: {
          title?: string
          description?: string
          assignee?: User | null
          storyPoints?: number
          startDate?: string | null
          endDate?: string | null
          status?: Task['status']
        }
      }>
    ) => {
      // Görevin id'sini ve güncellenecek bilgileri alır
      const { id, updates } = action.payload
      // Görevin mevcut bilgilerini günceller
      state.tasks[id] = { ...state.tasks[id], ...updates }
    },
  },
})

// Action'ları ve reducer'ı dışa aktarma
export const { moveTask, addTask, updateTask } = boardSlice.actions
export default boardSlice.reducer
