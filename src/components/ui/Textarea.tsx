import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-2xl border-2 border-brown-200 bg-warm-50 px-4 py-3 text-sm text-brown-700 placeholder:text-brown-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200 resize-none',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
