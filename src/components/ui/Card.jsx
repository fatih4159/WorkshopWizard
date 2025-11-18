import React from 'react'

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  padding = true,
  hover = false,
  border = true,
  elevated = false,
  ...props
}) => {
  const hoverClass = hover ? 'hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer' : ''
  const paddingClass = padding ? 'p-6' : ''
  const borderClass = border ? 'border border-neutral-200' : ''
  const shadowClass = elevated ? 'shadow-soft-lg' : 'shadow-soft'

  return (
    <div
      className={`
        bg-white rounded-lg ${shadowClass} ${borderClass}
        ${hoverClass} ${paddingClass}
        transition-all duration-200 ease-out
        ${className}
      `}
      role={props.onClick ? 'button' : undefined}
      tabIndex={props.onClick ? 0 : undefined}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * Card variants for specific use cases
 */
export const InfoCard = ({ icon: Icon, title, value, trend, className = '' }) => {
  return (
    <Card className={`${className}`} padding hover elevated>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.text}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Card
