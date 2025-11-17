import React from 'react'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-primary-50',
  danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700',
  success: 'bg-success text-white hover:bg-green-600 active:bg-green-700'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.md
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  )
}

export default Button
