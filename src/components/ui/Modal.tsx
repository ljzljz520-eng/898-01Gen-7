import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, children, className }, ref) => {
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    if (!open) return null

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={cn(
            'relative w-full max-w-lg bg-warm-50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-brown-100">
              <h3 className="text-xl font-bold text-brown-700 font-display">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brown-100 text-brown-500 hover:bg-brown-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }
