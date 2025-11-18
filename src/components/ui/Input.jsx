import React, { useState } from 'react'
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  helpText,
  required = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  inputClassName = '',
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const hasError = !!error
  const hasSuccess = !!success && !hasError
  const actualType = showPasswordToggle && showPassword ? 'text' : type

  let borderClass = 'border-neutral-300 focus:ring-primary'
  if (hasError) {
    borderClass = 'border-error focus:ring-error'
  } else if (hasSuccess) {
    borderClass = 'border-success focus:ring-success'
  } else if (isFocused) {
    borderClass = 'border-primary focus:ring-primary'
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700">
          {label}
          {required && <span className="text-error ml-1" aria-label="Pflichtfeld">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 transition-colors ${
              hasError ? 'text-error' :
              hasSuccess ? 'text-success' :
              isFocused ? 'text-primary' :
              'text-neutral-400'
            }`} aria-hidden="true" />
          </div>
        )}

        <input
          type={actualType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${label}-error` :
            helpText ? `${label}-help` :
            undefined
          }
          className={`
            block w-full rounded-lg border-2 ${borderClass}
            ${Icon ? 'pl-10' : 'pl-3'}
            ${showPasswordToggle || hasError || hasSuccess ? 'pr-10' : 'pr-3'}
            py-2.5 min-h-[44px]
            text-neutral-900 placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            transition-all duration-200
            ${inputClassName}
          `}
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}

          {hasError && (
            <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />
          )}

          {hasSuccess && (
            <CheckCircle2 className="h-5 w-5 text-success animate-fade-in" aria-hidden="true" />
          )}
        </div>
      </div>

      {helpText && !hasError && (
        <p id={`${label}-help`} className="text-xs text-neutral-500">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={`${label}-error`} className="text-sm text-error flex items-center gap-1 animate-slide-in" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {hasSuccess && !hasError && (
        <p className="text-sm text-success flex items-center gap-1 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          {success}
        </p>
      )}
    </div>
  )
}

export default Input
