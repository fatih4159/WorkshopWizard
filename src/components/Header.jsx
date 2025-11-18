import React, { useState, useEffect } from 'react'
import { Save, Download, Upload, Trash2, HelpCircle, Settings, Menu, X, ArrowLeft } from 'lucide-react'
import Button from './ui/Button'
import Tooltip from './ui/Tooltip'
import SettingsModal from './ui/SettingsModal'
import { useWorkshop } from '../context/WorkshopContext'
import { exportAsJSON, importFromJSON, clearStorage } from '../utils/storage'
import { useToast } from './ui/Toast'
import { loadDemoData } from '../utils/templates'

const Header = ({ onBackToList }) => {
  const { state, dispatch, Actions } = useWorkshop()
  const { showToast } = useToast()
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving', 'saved', 'unsaved', 'error'
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auto-save indicator
  useEffect(() => {
    setSaveStatus('saving')
    const timer = setTimeout(() => {
      setSaveStatus('saved')
    }, 500)
    return () => clearTimeout(timer)
  }, [state])

  const handleExportJSON = () => {
    const success = exportAsJSON(state, `workshop-${state.customer.name || 'export'}.json`)
    if (success) {
      showToast('Daten erfolgreich exportiert', 'success')
    } else {
      showToast('Export fehlgeschlagen', 'error')
    }
  }

  const handleImportJSON = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      try {
        const data = await importFromJSON(file)
        dispatch({ type: Actions.LOAD_DATA, payload: data })
        showToast('Daten erfolgreich importiert', 'success')
      } catch (error) {
        showToast('Import fehlgeschlagen: ' + error.message, 'error')
      }
    }

    input.click()
  }

  const handleLoadDemo = () => {
    const demoData = loadDemoData()
    dispatch({ type: Actions.LOAD_DATA, payload: demoData })
    showToast('Demo-Daten geladen', 'success')
  }

  const handleReset = () => {
    if (window.confirm('Möchten Sie wirklich alle Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      dispatch({ type: Actions.RESET_DATA })
      clearStorage()
      showToast('Alle Daten wurden zurückgesetzt', 'info')
    }
  }

  const saveStatusIcons = {
    saving: (
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Save className="w-4 h-4 animate-pulse" />
        <span>Speichert...</span>
      </div>
    ),
    saved: (
      <div className="flex items-center gap-2 text-sm text-success">
        <Save className="w-4 h-4" />
        <span>Gespeichert</span>
      </div>
    ),
    unsaved: (
      <div className="flex items-center gap-2 text-sm text-warning">
        <Save className="w-4 h-4" />
        <span>Nicht gespeichert</span>
      </div>
    ),
    error: (
      <div className="flex items-center gap-2 text-sm text-error">
        <Save className="w-4 h-4" />
        <span>Speichern fehlgeschlagen</span>
      </div>
    )
  }

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm no-print sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md transform transition-transform hover:scale-105">
              W
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900">Workshop Wizard</h1>
              <p className="text-xs text-neutral-500 hidden sm:block">Workflow-Automatisierung</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* Save Status */}
            <div className="hidden xl:block">{saveStatusIcons[saveStatus]}</div>

            {/* Back to Workshops Button */}
            {onBackToList && (
              <Tooltip content="Zurück zur Workshop-Liste" position="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToList}
                  icon={ArrowLeft}
                  ariaLabel="Zurück zur Workshop-Liste"
                />
              </Tooltip>
            )}

            {/* Demo Data Button */}
            <Tooltip content="Demo-Daten laden" position="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadDemo}
                icon={Download}
                ariaLabel="Demo-Daten laden"
              />
            </Tooltip>

            {/* Export */}
            <Tooltip content="Daten exportieren" position="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportJSON}
                icon={Download}
                ariaLabel="Daten exportieren"
              />
            </Tooltip>

            {/* Import */}
            <Tooltip content="Daten importieren" position="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImportJSON}
                icon={Upload}
                ariaLabel="Daten importieren"
              />
            </Tooltip>

            {/* Reset */}
            <Tooltip content="Alle Daten zurücksetzen" position="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                icon={Trash2}
                ariaLabel="Alle Daten zurücksetzen"
              />
            </Tooltip>

            {/* Settings */}
            <Tooltip content="Einstellungen" position="bottom">
              <Button
                variant="ghost"
                size="sm"
                icon={Settings}
                ariaLabel="Einstellungen"
                onClick={() => setShowSettingsModal(true)}
              />
            </Tooltip>

            {/* Help */}
            <Tooltip content="Hilfe" position="bottom">
              <Button
                variant="ghost"
                size="sm"
                icon={HelpCircle}
                ariaLabel="Hilfe anzeigen"
                onClick={() => showToast('Hilfe-Funktion wird noch implementiert', 'info')}
              />
            </Tooltip>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 animate-slide-in">
            <nav className="space-y-2" role="navigation" aria-label="Mobile Menü">
              {/* Save Status */}
              <div className="px-3 py-2">{saveStatusIcons[saveStatus]}</div>

              {/* Back to Workshops Button (Mobile) */}
              {onBackToList && (
                <button
                  onClick={() => {
                    onBackToList()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
                >
                  <ArrowLeft className="w-5 h-5 text-neutral-600" />
                  <span className="font-medium text-neutral-900">Zurück zu Workshops</span>
                </button>
              )}

              <button
                onClick={() => {
                  handleLoadDemo()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
              >
                <Download className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">Demo-Daten laden</span>
              </button>

              <button
                onClick={() => {
                  handleExportJSON()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
              >
                <Download className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">Daten exportieren</span>
              </button>

              <button
                onClick={() => {
                  handleImportJSON()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
              >
                <Upload className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">Daten importieren</span>
              </button>

              <button
                onClick={() => {
                  handleReset()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
              >
                <Trash2 className="w-5 h-5 text-error" />
                <span className="font-medium text-neutral-900">Alle Daten zurücksetzen</span>
              </button>

              <button
                onClick={() => {
                  setShowSettingsModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
              >
                <Settings className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">Einstellungen</span>
              </button>

              <button
                onClick={() => {
                  showToast('Hilfe-Funktion wird noch implementiert', 'info')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors text-left min-h-[44px]"
              >
                <HelpCircle className="w-5 h-5 text-neutral-600" />
                <span className="font-medium text-neutral-900">Hilfe</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </header>
  )
}

export default Header
