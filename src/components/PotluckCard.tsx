import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import type { PotluckEvent } from '../../shared/types'

interface PotluckCardProps {
  potluck: PotluckEvent
  className?: string
}

const statusConfig = {
  recruiting: { label: '招募中', variant: 'success' as const },
  full: { label: '已满员', variant: 'warning' as const },
  completed: { label: '已结束', variant: 'default' as const },
  cancelled: { label: '已取消', variant: 'error' as const },
}

export default function PotluckCard({ potluck, className }: PotluckCardProps) {
  const participantCount = potluck.participants.length
  const progress = (participantCount / potluck.maxParticipants) * 100
  const status = statusConfig[potluck.status]

  return (
    <Link
      to={`/potlucks/${potluck.id}`}
      className={cn(
        'group relative block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-brown-700 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {potluck.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-brown-500">
              <ChefHat className="w-3.5 h-3.5 text-primary-500" />
              <span className="line-clamp-1">{potluck.recipe?.title || '待定菜谱'}</span>
            </div>
          </div>
          <Tag variant={status.variant} size="sm">
            {status.label}
          </Tag>
        </div>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-brown-500">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{potluck.date} {potluck.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brown-500">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="line-clamp-1">{potluck.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brown-500">
            <Users className="w-4 h-4 text-primary-500" />
            <span>{participantCount} / {potluck.maxParticipants} 人</span>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs text-brown-500 mb-1.5">
            <span>参与进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                potluck.status === 'full'
                  ? 'bg-secondary-500'
                  : 'bg-gradient-primary'
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brown-100">
          <div className="flex -space-x-2">
            {potluck.participants.slice(0, 5).map((p, idx) => (
              <img
                key={idx}
                src={p.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                alt={p.user?.name || '参与者'}
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <span className="text-sm text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
            查看详情 →
          </span>
        </div>
      </div>
    </Link>
  )
}
