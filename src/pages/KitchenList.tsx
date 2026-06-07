import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus, UtensilsCrossed, X, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import KitchenCard from '@/components/KitchenCard'
import Loading from '@/components/Loading'
import { api } from '@/utils/api'
import type { KitchenEvent, Recipe } from '../../shared/types'

const filterTabs = [
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'all', label: '全部' },
]

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

export default function KitchenList() {
  const [kitchens, setKitchens] = useState<KitchenEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeSearch, setRecipeSearch] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [formData, setFormData] = useState({
    title: '', date: '', startTime: '', endTime: '', location: '', maxParticipants: 8, description: '',
  })

  const fetchRecipes = async () => {
    try {
      const data = await api.recipes.getList({ pageSize: 50 })
      setRecipes(data.list)
    } catch (e) {
      console.error('Failed to fetch recipes:', e)
    }
  }

  const loadKitchens = async () => {
    try {
      setLoading(true)
      const data = await api.kitchens.getList()
      const now = new Date()
      let filtered = data
      if (activeFilter === 'week') {
        const weekEnd = new Date(now)
        weekEnd.setDate(now.getDate() + 7)
        filtered = data.filter(k => {
          const d = new Date(k.date)
          return d >= now && d <= weekEnd
        })
      } else if (activeFilter === 'month') {
        filtered = data.filter(k => {
          const d = new Date(k.date)
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
      }
      setKitchens(filtered)
    } catch (e) {
      console.error('Failed to fetch kitchens:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKitchens()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  const handleCreateEvent = async () => {
    if (!selectedRecipe) return
    try {
      await api.kitchens.create({ ...formData, recipeId: selectedRecipe.id, hostId: 'u1' })
      setShowModal(false)
      setFormData({ title: '', date: '', startTime: '', endTime: '', location: '', maxParticipants: 8, description: '' })
      setSelectedRecipe(null)
      setRecipeSearch('')
      loadKitchens()
    } catch (e) {
      console.error('Failed to create event:', e)
    }
  }

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(recipeSearch.toLowerCase())
  )

  const openModal = () => {
    setShowModal(true)
    fetchRecipes()
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="bg-gradient-primary text-white">
        <div className="container py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <UtensilsCrossed className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-2xl md:text-4xl font-bold font-display">共享厨房·厨艺交流</h1>
          </div>
          <p className="text-white/90 text-base md:text-xl">线下一起做美食，分享美味与快乐</p>
        </div>
      </div>

      <div className="container -mt-5">
        <div className="bg-white rounded-3xl shadow-card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-warm-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-brown-600" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-lg font-semibold text-brown-700">{currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}</span>
            </div>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-warm-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-brown-600" />
            </button>
          </div>
          <div className="flex gap-2">
            {filterTabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveFilter(tab.key)} className={cn(
                'flex-1 py-2 px-4 rounded-full font-medium transition-all duration-200',
                activeFilter === tab.key ? 'bg-gradient-primary text-white shadow-md' : 'bg-warm-100 text-brown-600 hover:bg-warm-200'
              )}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16"><Loading text="加载中..." /></div>
        ) : kitchens.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-warm-100 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-brown-700 mb-2">暂无活动</h3>
            <p className="text-brown-500 mb-6">快来创建第一个共享厨房活动吧！</p>
            <Button onClick={openModal}><Plus className="w-5 h-5" />创建活动</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
            {kitchens.map((k) => <KitchenCard key={k.id} kitchen={k} />)}
          </div>
        )}
      </div>

      <button onClick={openModal} className="fixed bottom-6 right-6 z-40 bg-gradient-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
        <Plus className="w-6 h-6" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-card-hover w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-brown-100 p-5 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-xl font-bold text-brown-700">创建活动</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-warm-100 transition-colors">
                <X className="w-5 h-5 text-brown-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-1.5">活动标题</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="例如：周末家常菜聚会" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-1.5">选择菜谱 <span className="text-red-500">*</span></label>
                <Input value={recipeSearch} onChange={(e) => setRecipeSearch(e.target.value)} placeholder={selectedRecipe ? selectedRecipe.title : '搜索并选择菜谱...'} icon={<ChefHat className="w-4 h-4" />} />
                {filteredRecipes.length > 0 && recipeSearch && (
                  <div className="mt-2 bg-white rounded-2xl shadow-card border border-brown-100 max-h-48 overflow-y-auto">
                    {filteredRecipes.map((r) => (
                      <button key={r.id} onClick={() => { setSelectedRecipe(r); setRecipeSearch('') }} className="w-full p-3 text-left hover:bg-warm-50 flex items-center gap-3 transition-colors">
                        <img src={r.coverImage} alt={r.title} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-medium text-brown-700 text-sm">{r.title}</div>
                          <div className="text-xs text-brown-500">{r.cuisine}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedRecipe && (
                  <div className="mt-2">
                    <Tag variant="primary" size="sm" closable onClose={() => setSelectedRecipe(null)}>{selectedRecipe.title}</Tag>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1.5">日期</label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} icon={<Calendar className="w-4 h-4" />} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1.5">最大人数</label>
                  <Input type="number" min="2" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1.5">开始时间</label>
                  <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1.5">结束时间</label>
                  <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-1.5">活动地点</label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="例如：社区共享厨房A区" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-1.5">活动描述</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="介绍一下这次活动..." rows={2} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-brown-100 p-5 rounded-b-3xl">
              <Button className="w-full" onClick={handleCreateEvent} disabled={!selectedRecipe}>
                <Plus className="w-5 h-5" />创建活动
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
