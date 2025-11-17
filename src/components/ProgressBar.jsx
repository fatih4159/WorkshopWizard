import React from 'react'
import { Check } from 'lucide-react'
import { useWorkshop } from '../context/WorkshopContext'
import { WORKSHOP_STEPS } from '../utils/constants'

const ProgressBar = () => {
  const { state } = useWorkshop()
  const currentStep = state.currentStep

  const progress = (currentStep / WORKSHOP_STEPS.length) * 100

  return (
    <div className="bg-white border-b border-neutral-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Schritt {currentStep} von {WORKSHOP_STEPS.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {WORKSHOP_STEPS.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isPending = stepNumber > currentStep

            return (
              <div
                key={step.id}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                  ${isCurrent ? 'bg-primary-50 border-2 border-primary' : ''}
                  ${isCompleted ? 'bg-green-50' : ''}
                  ${isPending ? 'opacity-50' : ''}
                `}
              >
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
                    ${isCurrent ? 'bg-primary text-white' : ''}
                    ${isCompleted ? 'bg-success text-white' : ''}
                    ${isPending ? 'bg-neutral-200 text-neutral-500' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                <span
                  className={`
                    text-xs text-center font-medium
                    ${isCurrent ? 'text-primary' : ''}
                    ${isCompleted ? 'text-success' : ''}
                    ${isPending ? 'text-neutral-500' : ''}
                  `}
                >
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
