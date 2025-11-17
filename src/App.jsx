import React from 'react'
import { WorkshopProvider } from './context/WorkshopContext'
import { ToastProvider } from './components/ui/Toast'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'

// Import Steps
import Step1_CustomerInfo from './components/steps/Step1_CustomerInfo'
import Step2_ToolLandscape from './components/steps/Step2_ToolLandscape'
import Step3_ProcessCapture from './components/steps/Step3_ProcessCapture'
import Step4_AutomationScenarios from './components/steps/Step4_AutomationScenarios'
import Step5_Prioritization from './components/steps/Step5_Prioritization'
import Step6_ROICalculation from './components/steps/Step6_ROICalculation'
import Step7_PackageRecommendation from './components/steps/Step7_PackageRecommendation'
import Step8_Summary from './components/steps/Step8_Summary'

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WorkshopProvider>
          <AppContent />
        </WorkshopProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

const AppContent = () => {
  const { state } = useWorkshop()
  const currentStep = state.currentStep

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_CustomerInfo />
      case 2:
        return <Step2_ToolLandscape />
      case 3:
        return <Step3_ProcessCapture />
      case 4:
        return <Step4_AutomationScenarios />
      case 5:
        return <Step5_Prioritization />
      case 6:
        return <Step6_ROICalculation />
      case 7:
        return <Step7_PackageRecommendation />
      case 8:
        return <Step8_Summary />
      default:
        return <Step1_CustomerInfo />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <ProgressBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
        {renderStep()}
      </main>

      <Navigation />
    </div>
  )
}

// Import useWorkshop hook
import { useWorkshop } from './context/WorkshopContext'

export default App
