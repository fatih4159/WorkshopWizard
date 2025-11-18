import React from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
  secondary: 'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-sm',
  ghost: 'text-primary hover:bg-primary-50 active:bg-primary-100',
  danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md',
  success: 'bg-success text-white hover:bg-green-600 active:bg-green-700 shadow-sm hover:shadow-md'
}

const sizes = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-base min-h-[40px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]'
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95'
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.md
  const widthClass = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>{children || 'Laden...'}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" aria-hidden="true" />}
        </>
      )}
    </button>
  )
}

export default Button
