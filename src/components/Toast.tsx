import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; bgColor: string; iconColor: string; borderColor: string }> = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    borderColor: 'border-green-200',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
  },
  info: {
    icon: AlertCircle,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-200',
  },
}

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const config = toastConfig[toast.type]
  const Icon = config.icon

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={cn(
        'flex items-start gap-3 min-w-[300px] max-w-md p-4 rounded-2xl border shadow-lg animate-fade-in-up',
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      <p className="flex-1 text-sm text-brown-700">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 text-brown-400" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastComponentProps {
  type?: ToastType
  message: string
  className?: string
}

export default function Toast({ type = 'info', message, className }: ToastComponentProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-2xl border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', config.iconColor)} />
      <p className="flex-1 text-sm text-brown-700">{message}</p>
    </div>
  )
}
