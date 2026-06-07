import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-gradient-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
      secondary: 'bg-secondary-500 text-white shadow-md hover:bg-secondary-600 hover:-translate-y-0.5 active:translate-y-0',
      outline: 'border-2 border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 hover:-translate-y-0.5',
      ghost: 'text-brown-600 bg-transparent hover:bg-warm-100 hover:-translate-y-0.5',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-4 text-sm',
      md: 'h-10 px-6 text-base',
      lg: 'h-12 px-8 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
