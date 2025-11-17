import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './ui/Button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-soft-lg p-8 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Ups! Etwas ist schiefgelaufen
            </h1>

            <p className="text-neutral-600 mb-6">
              Die Anwendung ist auf einen unerwarteten Fehler gestoßen.
              Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                  Fehlerdetails anzeigen
                </summary>
                <pre className="mt-2 p-4 bg-neutral-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <Button onClick={this.handleReset} fullWidth>
              Anwendung neu laden
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
