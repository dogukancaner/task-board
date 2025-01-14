'use client'

import TeamMembers from './TeamMembers'
import AddTaskButton from './AddTaskButton'

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
      <div className="flex items-center gap-4">
        <TeamMembers />
        <AddTaskButton />
      </div>
    </div>
  )
}
