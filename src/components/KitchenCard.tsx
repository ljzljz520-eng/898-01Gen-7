import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import type { KitchenEvent } from '../../shared/types'

interface KitchenCardProps {
  kitchen: KitchenEvent
  className?: string
}

const statusConfig = {
  upcoming: { label: '即将开始', variant: 'primary' as const },
  ongoing: { label: '进行中', variant: 'success' as const },
  completed: { label: '已结束', variant: 'default' as const },
  cancelled: { label: '已取消', variant: 'error' as const },
}

export default function KitchenCard({ kitchen, className }: KitchenCardProps) {
  const participantCount = kitchen.participants.length
  const status = statusConfig[kitchen.status]

  return (
    <Link
      to={`/kitchens/${kitchen.id}`}
      className={cn(
        'group relative block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={kitchen.recipe?.coverImage || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop'}
          alt={kitchen.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 right-3">
          <Tag variant={status.variant} size="sm">
            {status.label}
          </Tag>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg line-clamp-1 drop-shadow-md">
            {kitchen.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-sm text-brown-500 mb-4">
          <ChefHat className="w-3.5 h-3.5 text-primary-500" />
          <span className="line-clamp-1">{kitchen.recipe?.title || '待定菜谱'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-brown-500">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{kitchen.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brown-500">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{kitchen.startTime} - {kitchen.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brown-500 col-span-2">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="line-clamp-1">{kitchen.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brown-500 col-span-2">
            <Users className="w-4 h-4 text-primary-500" />
            <span>{participantCount} / {kitchen.maxParticipants} 人已报名</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brown-100">
          <div className="flex -space-x-2">
            {kitchen.participants.slice(0, 5).map((p, idx) => (
              <img
                key={idx}
                src={p.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                alt={p.user?.name || '参与者'}
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
            ))}
            {participantCount > 5 && (
              <div className="w-7 h-7 rounded-full border-2 border-white bg-brown-100 flex items-center justify-center text-brown-500 text-xs font-medium">
                +{participantCount - 5}
              </div>
            )}
          </div>
          <span className="text-sm text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
            查看详情 →
          </span>
        </div>
      </div>
    </Link>
  )
}
