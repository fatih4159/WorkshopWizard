import React from 'react'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import Button from './ui/Button'
import { useWorkshop } from '../context/WorkshopContext'
import { WORKSHOP_STEPS } from '../utils/constants'

const Navigation = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const currentStep = state.currentStep

  const canGoBack = currentStep > 1
  const canGoForward = currentStep < WORKSHOP_STEPS.length

  const handlePrevious = () => {
    if (canGoBack) {
      dispatch({ type: Actions.SET_STEP, payload: currentStep - 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (canGoForward) {
      dispatch({ type: Actions.SET_STEP, payload: currentStep + 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoToStep = (stepNumber) => {
    dispatch({ type: Actions.SET_STEP, payload: stepNumber })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className="bg-white border-t border-neutral-200 shadow-lg no-print sticky bottom-0 z-40 safe-area-bottom"
      role="navigation"
      aria-label="Workshop Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoBack}
            icon={ChevronLeft}
            iconPosition="left"
            ariaLabel="Zurück zum vorherigen Schritt"
            size="lg"
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Zurück</span>
          </Button>

          {/* Step Indicator */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            <Button
              variant="ghost"
              size="sm"
              icon={Home}
              onClick={() => handleGoToStep(1)}
              ariaLabel="Zum ersten Schritt"
              className="touch-target"
            />
            <span className="text-sm font-semibold text-neutral-700 px-4 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
              {WORKSHOP_STEPS[currentStep - 1]?.title}
            </span>
          </div>

          {/* Mobile Step Indicator */}
          <div className="md:hidden flex-1 text-center">
            <span className="text-xs font-semibold text-neutral-600">
              {currentStep} / {WORKSHOP_STEPS.length}
            </span>
          </div>

          {/* Next Button */}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canGoForward}
            icon={ChevronRight}
            iconPosition="right"
            ariaLabel="Weiter zum nächsten Schritt"
            size="lg"
            className="flex-shrink-0"
          >
            {currentStep === WORKSHOP_STEPS.length ? (
              <span>Fertig</span>
            ) : (
              <span className="hidden sm:inline">Weiter</span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
