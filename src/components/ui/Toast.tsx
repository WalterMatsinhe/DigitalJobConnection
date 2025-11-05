import React, { useEffect, useState } from 'react'
import { MdClose, MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastProps {
  toast: ToastMessage
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (toast.duration === 0) return

    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(toast.id), 300)
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const getStyles = () => {
    const baseStyles = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border'
    const typeStyles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
    return `${baseStyles} ${typeStyles[toast.type]}`
  }

  const getIcon = () => {
    const iconProps = { size: 20, className: 'flex-shrink-0' }
    switch (toast.type) {
      case 'success':
        return <MdCheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />
      case 'error':
        return <MdError {...iconProps} className={`${iconProps.className} text-red-600`} />
      case 'warning':
        return <MdWarning {...iconProps} className={`${iconProps.className} text-yellow-600`} />
      case 'info':
        return <MdInfo {...iconProps} className={`${iconProps.className} text-blue-600`} />
      default:
        return null
    }
  }

  return (
    <div
      className={`transform transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-95 translate-x-full' : 'opacity-100 scale-100 translate-x-0'
      }`}
    >
      <div className={getStyles()}>
        {getIcon()}
        <span className="flex-1 text-sm font-medium">{toast.message}</span>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => onClose(toast.id), 300)
          }}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <MdClose size={18} />
        </button>
      </div>
    </div>
  )
}

export default Toast
