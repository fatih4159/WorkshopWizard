import React from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Bitte wählen...',
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
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
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            block w-full rounded-lg border ${borderClass} pl-3 pr-10 py-2
            text-neutral-900
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            transition-colors duration-200
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-neutral-400" />
        </div>
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

export default Select
