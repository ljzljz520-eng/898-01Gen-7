import * as React from 'react'
import { cn } from '@/lib/utils'

type TagVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
type TagSize = 'sm' | 'md' | 'lg'

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TagVariant
  size?: TagSize
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant = 'default', size = 'md', icon, closable, onClose, children, ...props }, ref) => {
    const variants: Record<TagVariant, string> = {
      default: 'bg-brown-100 text-brown-600',
      primary: 'bg-primary-100 text-primary-600',
      secondary: 'bg-secondary-100 text-secondary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
    }

    const sizes: Record<TagSize, string> = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-1.5',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="ml-1 hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    )
  }
)

Tag.displayName = 'Tag'

export { Tag }
