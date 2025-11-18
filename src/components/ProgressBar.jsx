import React from 'react'
import { Check } from 'lucide-react'
import { useWorkshop } from '../context/WorkshopContext'
import { WORKSHOP_STEPS } from '../utils/constants'

const ProgressBar = () => {
  const { state } = useWorkshop()
  const currentStep = state.currentStep

  const progress = (currentStep / WORKSHOP_STEPS.length) * 100

  return (
    <nav
      className="bg-white border-b border-neutral-200 no-print"
      aria-label="Workshop Fortschritt"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Bar */}
        <div className="mb-4" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-700">
              Schritt {currentStep} von {WORKSHOP_STEPS.length}
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-primary to-primary-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
              aria-hidden="true"
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
                  flex flex-col items-center gap-1.5 p-2 rounded-lg
                  transition-all duration-200 ease-out
                  ${isCurrent ? 'bg-primary-50 border-2 border-primary scale-105' : 'border-2 border-transparent'}
                  ${isCompleted ? 'bg-success-50' : ''}
                  ${isPending ? 'opacity-60' : ''}
                `}
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.title} - ${isCompleted ? 'abgeschlossen' : isCurrent ? 'aktuell' : 'ausstehend'}`}
              >
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    font-bold text-sm shadow-sm transition-all duration-200
                    ${isCurrent ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' : ''}
                    ${isCompleted ? 'bg-success text-white' : ''}
                    ${isPending ? 'bg-neutral-200 text-neutral-500' : ''}
                  `}
                  aria-hidden="true"
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span
                  className={`
                    text-xs text-center font-medium leading-tight
                    ${isCurrent ? 'text-primary font-bold' : ''}
                    ${isCompleted ? 'text-success font-semibold' : ''}
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
    </nav>
  )
}

export default ProgressBar
