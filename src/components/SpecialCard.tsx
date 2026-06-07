import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SpecialCollection } from '../../shared/types'

interface SpecialCardProps {
  special: SpecialCollection
  className?: string
}

export default function SpecialCard({ special, className }: SpecialCardProps) {
  return (
    <Link
      to={`/specials/${special.id}`}
      className={cn(
        'group relative block rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={special.coverImage}
          alt={special.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-primary text-white text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>节日专题</span>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-600 text-sm font-medium shadow-md">
            {special.festival}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white font-bold text-2xl mb-2 font-display line-clamp-1">
            {special.title}
          </h3>
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {special.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {special.recipes?.slice(0, 4).map((recipe, idx) => (
                <img
                  key={idx}
                  src={recipe.coverImage}
                  alt={recipe.title}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
              {special.recipeIds.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-500 flex items-center justify-center text-white text-xs font-medium">
                  +{special.recipeIds.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
              <span>查看详情</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary-300/50 rounded-3xl transition-colors pointer-events-none" />
    </Link>
  )
}
