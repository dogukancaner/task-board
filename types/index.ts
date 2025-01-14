export interface User {
  id: string
  name: string
  avatar: string
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

export interface Board {
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: string[]
}
