import { cn } from '@/lib/utils'

type LoadingSize = 'sm' | 'md' | 'lg'

interface LoadingProps {
  size?: LoadingSize
  text?: string
  className?: string
  containerClassName?: string
}

const sizeConfig: Record<LoadingSize, { spinner: string; text: string }> = {
  sm: { spinner: 'w-5 h-5 border-2', text: 'text-sm' },
  md: { spinner: 'w-8 h-8 border-3', text: 'text-base' },
  lg: { spinner: 'w-12 h-12 border-4', text: 'text-lg' },
}

export default function Loading({
  size = 'md',
  text,
  className,
  containerClassName,
}: LoadingProps) {
  const config = sizeConfig[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        containerClassName
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-transparent border-t-primary-500 border-r-primary-400',
          config.spinner,
          className
        )}
      />
      {text && (
        <span className={cn('text-brown-500 font-medium', config.text)}>
          {text}
        </span>
      )}
    </div>
  )
}

export function LoadingFullScreen({
  text = '加载中...',
  size = 'lg',
}: {
  text?: string
  size?: LoadingSize
}) {
  return (
    <div className="fixed inset-0 bg-warm-50/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-card-hover p-8 flex flex-col items-center gap-4 animate-scale-in">
        <div
          className={cn(
            'animate-spin rounded-full border-transparent border-t-primary-500 border-r-primary-400',
            sizeConfig[size].spinner
          )}
        />
        <span className="text-brown-600 font-medium">{text}</span>
      </div>
    </div>
  )
}

export function LoadingInline({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-brown-500">
      <div className="w-4 h-4 animate-spin rounded-full border-2 border-transparent border-t-primary-500" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}
