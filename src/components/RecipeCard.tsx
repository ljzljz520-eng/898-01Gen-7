import { Link } from 'react-router-dom'
import { Heart, MessageCircle, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import type { Recipe } from '../../shared/types'

interface RecipeCardProps {
  recipe: Recipe
  className?: string
  onFavorite?: (recipeId: string) => void
}

export default function RecipeCard({ recipe, className, onFavorite }: RecipeCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(recipe.id)
  }

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className={cn(
        'group relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.coverImage}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <Tag variant="primary" size="sm" icon={<ChefHat className="w-3 h-3" />}>
            {recipe.cuisine}
          </Tag>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg line-clamp-1 drop-shadow-md">
            {recipe.title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={recipe.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
              alt={recipe.author?.name || '作者'}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span className="text-sm text-brown-600 font-medium">
              {recipe.author?.name || '匿名用户'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-brown-500">
            <button
              onClick={handleFavorite}
              className="flex items-center gap-1 text-sm hover:scale-110 transition-transform"
            >
              <Heart className="w-4 h-4 text-primary-500" />
              <span>{recipe.favoriteCount}</span>
            </button>
            <div className="flex items-center gap-1 text-sm">
              <MessageCircle className="w-4 h-4 text-secondary-500" />
              <span>{recipe.commentCount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.taste.slice(0, 3).map((taste) => (
            <Tag key={taste} variant="default" size="sm">
              {taste}
            </Tag>
          ))}
          {recipe.taste.length > 3 && (
            <Tag variant="default" size="sm">
              +{recipe.taste.length - 3}
            </Tag>
          )}
        </div>
      </div>
    </Link>
  )
}
