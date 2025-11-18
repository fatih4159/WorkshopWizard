import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WorkshopProvider, useWorkshop } from './context/WorkshopContext'
import { ToastProvider } from './components/ui/Toast'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import WorkshopList from './components/WorkshopList'

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
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  return <WorkshopManager />
}

const WorkshopManager = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)

  const handleSelectWorkshop = (workshop) => {
    setSelectedWorkshop(workshop)
  }

  const handleBackToList = () => {
    setSelectedWorkshop(null)
  }

  if (!selectedWorkshop) {
    return <WorkshopList onSelectWorkshop={handleSelectWorkshop} />
  }

  return (
    <WorkshopProvider workshop={selectedWorkshop}>
      <WorkshopContent onBackToList={handleBackToList} />
    </WorkshopProvider>
  )
}

const WorkshopContent = ({ onBackToList }) => {
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
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Zum Hauptinhalt springen
      </a>

      <Header onBackToList={onBackToList} />
      <ProgressBar />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20"
        role="main"
        aria-label="Hauptinhalt"
      >
        <div className="animate-fade-in">
          {renderStep()}
        </div>
      </main>

      <Navigation />
    </div>
  )
}

export default App
