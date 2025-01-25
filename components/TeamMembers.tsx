'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import MemberCard from './MemberCard'

export default function TeamMembers() {
  // Redux store'dan users'ı al
  const users = useSelector((state: RootState) => state.board.users)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {users.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
