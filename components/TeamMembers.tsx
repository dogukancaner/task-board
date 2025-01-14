'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TeamMembers() {
  const users = useSelector((state: RootState) => state.board.users)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
            >
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function UserGroupIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  )
}
