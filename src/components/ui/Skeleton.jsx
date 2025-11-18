import React from 'react'

/**
 * Skeleton Component - Loading placeholder
 * Provides visual feedback during data loading
 */
const Skeleton = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  variant = 'default' // 'default', 'circular', 'rectangular'
}) => {
  const variantClasses = {
    default: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  return (
    <div
      className={`animate-pulse bg-neutral-200 ${variantClasses[variant]} ${width} ${height} ${className}`}
      role="status"
      aria-label="Laden..."
    />
  )
}

/**
 * Card Skeleton - For loading card components
 */
export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 space-y-4">
      <Skeleton height="h-6" width="w-1/3" />
      <div className="space-y-2">
        <Skeleton height="h-4" />
        <Skeleton height="h-4" width="w-5/6" />
        <Skeleton height="h-4" width="w-4/6" />
      </div>
    </div>
  )
}

/**
 * Table Skeleton - For loading table rows
 */
export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={colIndex} height="h-8" width={`w-${12/columns}/12`} />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Form Skeleton - For loading forms
 */
export const SkeletonForm = ({ fields = 4 }) => {
  return (
    <div className="space-y-4">
      {[...Array(fields)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton height="h-4" width="w-1/4" />
          <Skeleton height="h-10" />
        </div>
      ))}
    </div>
  )
}

export default Skeleton
