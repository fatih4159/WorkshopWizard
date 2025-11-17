import React, { useState, useEffect, createContext, useContext } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// Toast Context
const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type, duration }])

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

// Individual Toast
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-primary" />
  }

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div
      className={`
        flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg border shadow-soft
        ${backgrounds[type]} animate-slide-in
      `}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-neutral-900">{message}</p>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
        aria-label="Schließen"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
