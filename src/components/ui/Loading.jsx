import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Loading Component - Spinner with optional text
 * Provides visual feedback during operations
 */
const Loading = ({
  size = 'md',
  text = '',
  fullScreen = false,
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2
        className={`${sizes[size]} text-primary animate-spin`}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-neutral-600 font-medium animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">Laden...</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    )
  }

  return (
    <div role="status" aria-live="polite">
      {content}
    </div>
  )
}

/**
 * Inline Loading - Small loader for buttons and inline use
 */
export const InlineLoading = ({ className = '' }) => {
  return (
    <Loader2
      className={`w-4 h-4 animate-spin ${className}`}
      aria-label="Laden..."
    />
  )
}

export default Loading
