import React from 'react'
import { AlertCircle } from 'lucide-react'

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const hasError = !!error
  const borderClass = hasError ? 'border-error focus:ring-error' : 'border-neutral-300 focus:ring-primary'

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-neutral-400" />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            block w-full rounded-lg border ${borderClass} ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
            text-neutral-900 placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            transition-colors duration-200
            ${inputClassName}
          `}
          {...props}
        />

        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-error" />
          </div>
        )}
      </div>

      {helpText && !hasError && (
        <p className="text-sm text-neutral-500">{helpText}</p>
      )}

      {hasError && (
        <p className="text-sm text-error flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
