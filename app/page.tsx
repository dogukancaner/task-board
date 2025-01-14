'use client'

import Board from '../components/Board'
import TeamMembers from '@/components/TeamMembers'
import AddTaskButton from '@/components/AddTaskButton'
import Header from '@/components/Header'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 container mx-auto">
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="flex justify-between items-center mb-8">
          <TeamMembers />
          <AddTaskButton />
        </div>
        <Board />
      </div>
    </main>
  )
}
