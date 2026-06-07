import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', className)}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-full border-2 border-brown-200 bg-warm-50 px-4 py-2 text-sm text-brown-700 placeholder:text-brown-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
