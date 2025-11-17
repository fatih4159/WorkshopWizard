import React, { useState, useEffect } from 'react'
import { Save, Download, Upload, Trash2, HelpCircle } from 'lucide-react'
import Button from './ui/Button'
import { useWorkshop } from '../context/WorkshopContext'
import { exportAsJSON, importFromJSON, clearStorage } from '../utils/storage'
import { useToast } from './ui/Toast'
import { loadDemoData } from '../utils/templates'

const Header = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { showToast } = useToast()
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving', 'saved', 'unsaved', 'error'

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
    <header className="bg-white border-b border-neutral-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Workshop Wizard</h1>
                <p className="text-xs text-neutral-500">Workflow-Automatisierung</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Save Status */}
            {saveStatusIcons[saveStatus]}

            {/* Demo Data Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadDemo}
              icon={Download}
              ariaLabel="Demo-Daten laden"
            >
              Demo laden
            </Button>

            {/* Export */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportJSON}
              icon={Download}
              ariaLabel="Daten exportieren"
            >
              Export
            </Button>

            {/* Import */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImportJSON}
              icon={Upload}
              ariaLabel="Daten importieren"
            >
              Import
            </Button>

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={Trash2}
              ariaLabel="Alle Daten zurücksetzen"
            >
              Zurücksetzen
            </Button>

            {/* Help */}
            <Button
              variant="ghost"
              size="sm"
              icon={HelpCircle}
              ariaLabel="Hilfe anzeigen"
              onClick={() => showToast('Hilfe-Funktion wird noch implementiert', 'info')}
            >
              Hilfe
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
