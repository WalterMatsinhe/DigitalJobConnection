import React from 'react'
import Toast from '../ui/Toast'
import { useToast } from '../../context/ToastContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}
