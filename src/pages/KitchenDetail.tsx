import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, ChefHat, UtensilsCrossed, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import RecipeCard from '@/components/RecipeCard'
import Loading from '@/components/Loading'
import { api } from '@/utils/api'
import type { KitchenEvent } from '../../shared/types'

const statusConfig = {
  upcoming: { label: '即将开始', variant: 'primary' as const },
  ongoing: { label: '进行中', variant: 'success' as const },
  completed: { label: '已结束', variant: 'default' as const },
  cancelled: { label: '已取消', variant: 'error' as const },
}

export default function KitchenDetail() {
  const { id } = useParams<{ id: string }>()
  const [kitchen, setKitchen] = useState<KitchenEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const loadKitchen = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await api.kitchens.getById(id)
      setKitchen(data)
      setIsRegistered(data.participants.some(p => p.userId === 'u1'))
    } catch (e) {
      console.error('Failed to fetch kitchen:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKitchen()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleRegister = async () => {
    if (!id || !kitchen || isRegistered || registerLoading) return
    try {
      setRegisterLoading(true)
      await api.kitchens.register(id, 'u1')
      await loadKitchen()
    } catch (e) {
      console.error('Failed to register:', e)
    } finally {
      setRegisterLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loading text="加载中..." />
      </div>
    )
  }

  if (!kitchen) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-brown-300" />
          <p className="text-brown-500">活动不存在</p>
          <Link to="/kitchens" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const participantCount = kitchen.participants.length
  const isFull = participantCount >= kitchen.maxParticipants
  const status = statusConfig[kitchen.status]
  const canRegister = kitchen.status === 'upcoming' && !isFull && !isRegistered

  return (
    <div className="min-h-screen bg-gradient-warm pb-32">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={kitchen.recipe?.coverImage || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop'}
          alt={kitchen.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Link to="/kitchens">
            <button className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
        </div>
        <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-6">
          <Tag variant={status.variant} size="md" className="mb-3">
            {status.label}
          </Tag>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-display drop-shadow-lg">
            {kitchen.title}
          </h1>
        </div>
      </div>

      <div className="container -mt-6">
        <div className="bg-white rounded-3xl shadow-card p-5 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-2xl">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-brown-500">活动日期</div>
                <div className="font-medium text-brown-700">{kitchen.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-2xl">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <div className="text-xs text-brown-500">活动时间</div>
                <div className="font-medium text-brown-700">{kitchen.startTime} - {kitchen.endTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-2xl">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-brown-500">活动地点</div>
                <div className="font-medium text-brown-700">{kitchen.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-2xl">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <div className="text-xs text-brown-500">报名人数</div>
                <div className="font-medium text-brown-700">{participantCount} / {kitchen.maxParticipants} 人</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-2xl md:col-span-2">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-brown-500">活动主持人</div>
                <div className="flex items-center gap-2">
                  <img
                    src={kitchen.host?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                    alt={kitchen.host?.name || '主持人'}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-medium text-brown-700">{kitchen.host?.name || '待定'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {kitchen.recipe && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-brown-700 mb-4 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary-500" />
              本次菜谱
            </h2>
            <RecipeCard recipe={kitchen.recipe} />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-card p-5 md:p-6 mb-6">
          <h2 className="text-lg font-bold text-brown-700 mb-3">活动介绍</h2>
          <p className="text-brown-600 leading-relaxed">{kitchen.description || '暂无活动介绍'}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-5 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brown-700 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary-500" />
              已报名成员
            </h2>
            <span className="text-sm text-brown-500">{participantCount} 人</span>
          </div>
          {participantCount === 0 ? (
            <p className="text-brown-400 text-center py-4">暂无报名成员</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {kitchen.participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-warm-50 px-3 py-2 rounded-full">
                  <img
                    src={p.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                    alt={p.user?.name || '参与者'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-sm text-brown-700 font-medium">{p.user?.name || '匿名用户'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brown-100 p-4 md:p-5 shadow-lg">
        <div className="container">
          <Button
            className="w-full"
            size="lg"
            onClick={handleRegister}
            disabled={!canRegister || registerLoading}
          >
            {registerLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isRegistered ? (
              '已报名'
            ) : isFull ? (
              '名额已满'
            ) : kitchen.status !== 'upcoming' ? (
              '活动已结束'
            ) : (
              <>立即报名</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
