import { cn } from '@/lib/utils'

interface EmptyProps {
  text?: string
  className?: string
}

export default function Empty({ text = '暂无数据', className }: EmptyProps) {
  return (
    <div className={cn('flex h-full items-center justify-center text-gray-500', className)}>{text}</div>
  )
}
