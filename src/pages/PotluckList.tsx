import { useState, useEffect, useCallback } from 'react'
import { Plus, Utensils, Calendar, Clock, MapPin, Users, ChefHat, Search } from 'lucide-react'
import { api } from '@/utils/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import PotluckCard from '@/components/PotluckCard'
import type { PotluckEvent, Recipe } from '../../shared/types'

const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'recruiting', label: '招募中' },
  { key: 'full', label: '已满员' },
  { key: 'completed', label: '已结束' },
]

export default function PotluckList() {
  const [potlucks, setPotlucks] = useState<PotluckEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    recipeId: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 4,
    description: '',
  })
  const [recipeSearch, setRecipeSearch] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeListOpen, setRecipeListOpen] = useState(false)

  const fetchPotlucks = useCallback(async () => {
    setLoading(true)
    try {
      const status = activeFilter === 'all' ? undefined : activeFilter
      const data = await api.potlucks.getList(status)
      setPotlucks(data)
    } catch (error) {
      console.error('Failed to fetch potlucks:', error)
    } finally {
      setLoading(false)
    }
  }, [activeFilter])

  const fetchRecipes = useCallback(async () => {
    try {
      const data = await api.recipes.getList({ pageSize: 20 })
      setRecipes(data.list)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    }
  }, [])

  useEffect(() => {
    fetchPotlucks()
    fetchRecipes()
  }, [fetchPotlucks, fetchRecipes])

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(recipeSearch.toLowerCase())
  )

  const selectedRecipe = recipes.find((r) => r.id === formData.recipeId)

  const handleSubmit = async () => {
    if (!formData.title || !formData.recipeId || !formData.date || !formData.time || !formData.location) {
      return
    }
    try {
      await api.potlucks.create({
        ...formData,
        initiatorId: 'u1',
      })
      setModalOpen(false)
      setFormData({
        title: '',
        recipeId: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: 4,
        description: '',
      })
      fetchPotlucks()
    } catch (error) {
      console.error('Failed to create potluck:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <section className="relative bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-10" />
        <div className="container relative py-10 px-4">
          <div className="flex items-center gap-3 mb-2">
            <Utensils className="w-8 h-8" />
            <h1 className="text-3xl font-bold font-display">邻里拼菜·共享美味</h1>
          </div>
          <p className="text-white/80">一起做饭，分享美食，温暖邻里</p>
        </div>
        <div className="h-8 bg-gradient-warm rounded-t-3xl" />
      </section>

      <section className="container px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                activeFilter === tab.key
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'bg-white text-brown-600 hover:bg-warm-100'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        ) : potlucks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {potlucks.map((potluck) => (
              <PotluckCard key={potluck.id} potluck={potluck} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 bg-warm-100 rounded-full flex items-center justify-center mb-6">
              <Utensils className="w-16 h-16 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-brown-700 mb-2 font-display">
              暂无拼菜活动
            </h3>
            <p className="text-brown-500 mb-6 max-w-xs">
              发起第一个拼菜活动，邀请邻居一起共享美食吧！
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" />
              发起拼菜
            </Button>
          </div>
        )}
      </section>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="发起拼菜活动"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              活动标题
            </label>
            <Input
              placeholder="例如：周末一起做红烧肉"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              选择菜谱
            </label>
            <div className="relative">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="搜索菜谱..."
                value={recipeSearch}
                onChange={(e) => {
                  setRecipeSearch(e.target.value)
                  setRecipeListOpen(true)
                }}
                onFocus={() => setRecipeListOpen(true)}
              />
              {selectedRecipe && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-primary-50 rounded-xl">
                  <ChefHat className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-primary-700">{selectedRecipe.title}</span>
                </div>
              )}
              {recipeListOpen && filteredRecipes.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-brown-100 max-h-48 overflow-y-auto z-50">
                  {filteredRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => {
                        setFormData({ ...formData, recipeId: recipe.id })
                        setRecipeSearch(recipe.title)
                        setRecipeListOpen(false)
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-warm-50 transition-colors border-b border-brown-50 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-brown-700">
                        {recipe.title}
                      </div>
                      <div className="text-xs text-brown-500">{recipe.cuisine}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                日期
              </label>
              <Input
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                时间
              </label>
              <Input
                type="time"
                icon={<Clock className="w-4 h-4" />}
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              地点
            </label>
            <Input
              icon={<MapPin className="w-4 h-4" />}
              placeholder="例如：3栋201室"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              参与人数
            </label>
            <Input
              type="number"
              min={2}
              max={20}
              icon={<Users className="w-4 h-4" />}
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 4 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              活动说明
            </label>
            <Textarea
              placeholder="介绍一下活动，需要大家准备什么..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            发布活动
          </Button>
        </div>
      </Modal>
    </div>
  )
}
