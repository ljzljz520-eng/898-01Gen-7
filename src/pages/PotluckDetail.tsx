import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, Plus, Utensils, CheckCircle, ChefHat } from 'lucide-react'
import { api } from '@/utils/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Input } from '@/components/ui/Input'
import RecipeCard from '@/components/RecipeCard'
import type { PotluckEvent } from '../../shared/types'

const statusConfig = {
  recruiting: { label: '招募中', variant: 'success' as const },
  full: { label: '已满员', variant: 'warning' as const },
  completed: { label: '已结束', variant: 'default' as const },
  cancelled: { label: '已取消', variant: 'error' as const },
}

export default function PotluckDetail() {
  const { id } = useParams<{ id: string }>()
  const [potluck, setPotluck] = useState<PotluckEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [contribution, setContribution] = useState('')
  const currentUserId = 'u1'

  const fetchPotluckDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await api.potlucks.getById(id)
      setPotluck(data)
    } catch (error) {
      console.error('Failed to fetch potluck:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) fetchPotluckDetail()
  }, [id, fetchPotluckDetail])

  const handleJoin = async () => {
    if (!id) return
    try {
      await api.potlucks.join(id, currentUserId, contribution)
      setContribution('')
      fetchPotluckDetail()
    } catch (error) {
      console.error('Failed to join potluck:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm p-4">
        <div className="container">
          <div className="bg-white rounded-3xl h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!potluck) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <Utensils className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <p className="text-brown-500">活动不存在</p>
        </div>
      </div>
    )
  }

  const status = statusConfig[potluck.status]
  const participantCount = potluck.participants.length
  const progress = (participantCount / potluck.maxParticipants) * 100
  const hasJoined = potluck.participants.some((p) => p.userId === currentUserId)
  const isFull = potluck.status === 'full' || participantCount >= potluck.maxParticipants
  const canJoin = potluck.status === 'recruiting' && !hasJoined && !isFull

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="bg-gradient-primary text-white">
        <div className="container px-4 py-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold font-display flex-1 mr-4">
              {potluck.title}
            </h1>
            <Tag variant={status.variant} size="md">
              {status.label}
            </Tag>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Calendar className="w-4 h-4" />
              <span>{potluck.date}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{potluck.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MapPin className="w-4 h-4" />
              <span>{potluck.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <ChefHat className="w-4 h-4" />
              <span>发起人：{potluck.initiator?.name || '匿名'}</span>
            </div>
          </div>
        </div>
        <div className="h-8 bg-gradient-warm rounded-t-3xl" />
      </div>

      <div className="container px-4 -mt-2 space-y-6">
        {potluck.recipe && (
          <div>
            <h2 className="text-lg font-bold text-brown-700 font-display mb-3">
              关联菜谱
            </h2>
            <RecipeCard recipe={potluck.recipe} />
          </div>
        )}

        {potluck.description && (
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h2 className="text-lg font-bold text-brown-700 font-display mb-3">
              活动说明
            </h2>
            <p className="text-brown-600 leading-relaxed">{potluck.description}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brown-700 font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              参与者 ({participantCount}/{potluck.maxParticipants})
            </h2>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-brown-500 mb-1.5">
              <span>参与进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-warm-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isFull ? 'bg-secondary-500' : 'bg-gradient-primary'
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-3">
            {potluck.participants.map((participant, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-warm-50 rounded-2xl"
              >
                <img
                  src={participant.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                  alt={participant.user?.name || '参与者'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-brown-700">
                    {participant.user?.name || '匿名用户'}
                    {participant.userId === potluck.initiatorId && (
                      <Tag variant="primary" size="sm" className="ml-2">
                        发起人
                      </Tag>
                    )}
                  </div>
                  {participant.contribution && (
                    <div className="text-sm text-brown-500 truncate">
                      贡献：{participant.contribution}
                    </div>
                  )}
                </div>
                <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {potluck.ingredientSplit && potluck.ingredientSplit.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h2 className="text-lg font-bold text-brown-700 font-display mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary-500" />
              食材分配
            </h2>
            <div className="space-y-4">
              {potluck.ingredientSplit.map((split, idx) => {
                const user = potluck.participants.find((p) => p.userId === split.userId)?.user
                return (
                  <div key={idx} className="border-b border-brown-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                        alt={user?.name || '用户'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-brown-700">
                        {user?.name || '匿名用户'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-10">
                      {split.ingredients.map((ing, iIdx) => (
                        <Tag key={iIdx} variant="secondary" size="sm">
                          {ing.name} {ing.quantity}{ing.unit}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {canJoin && (
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h2 className="text-lg font-bold text-brown-700 font-display mb-4">
              我要参加
            </h2>
            <div className="space-y-3">
              <Input
                placeholder="说说你准备带什么（可选）"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
              />
              <Button className="w-full" onClick={handleJoin}>
                <Plus className="w-4 h-4" />
                加入拼菜
              </Button>
            </div>
          </div>
        )}

        {hasJoined && (
          <div className="bg-secondary-50 rounded-3xl p-5 text-center">
            <CheckCircle className="w-12 h-12 text-secondary-500 mx-auto mb-2" />
            <p className="text-secondary-700 font-medium">你已成功加入本次拼菜活动</p>
          </div>
        )}

        {isFull && !hasJoined && (
          <div className="bg-yellow-50 rounded-3xl p-5 text-center">
            <Users className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-700 font-medium">本次拼菜活动已满员</p>
          </div>
        )}
      </div>
    </div>
  )
}
