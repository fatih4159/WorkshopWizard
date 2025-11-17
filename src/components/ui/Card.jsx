import React from 'react'

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  padding = true,
  hover = false,
  ...props
}) => {
  const hoverClass = hover ? 'hover:shadow-soft-lg transition-shadow duration-200' : ''
  const paddingClass = padding ? 'p-6' : ''

  return (
    <div
      className={`bg-white rounded-lg shadow-soft ${hoverClass} ${paddingClass} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
