import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '../store/boardSlice'

interface MemberCardProps {
  user: User
}

export default function MemberCard({ user }: MemberCardProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {user.name[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-sm text-gray-700">{user.name}</p>
        <p className="text-xs text-gray-500">{user.role}</p>
      </div>
    </div>
  )
}
