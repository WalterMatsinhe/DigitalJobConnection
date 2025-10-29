import React from 'react'

export default function Button({ children, onClick, variant = 'primary', className = '' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost'; className?: string }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium'
  const styles = variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-transparent text-gray-700 hover:text-gray-900'
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  )
}
