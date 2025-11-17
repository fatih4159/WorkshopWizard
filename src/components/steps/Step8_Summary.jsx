import React, { useState } from 'react'
import { FileText, Download, Mail, Printer } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useWorkshop } from '../../context/WorkshopContext'
import { useToast } from '../ui/Toast'
import { PACKAGES } from '../../utils/constants'
import { calculateROI, formatCurrency, formatNumber, getTopProcesses, calculateRequiredWorkflows } from '../../utils/calculations'
import { exportAsJSON, exportAsCSV } from '../../utils/storage'
import { exportToPDF } from '../../utils/export'

const Step8_Summary = () => {
  const { state } = useWorkshop()
  const { showToast } = useToast()
  const { customer, processes, tools, automationScenarios, selectedPackage, hourlyRate } = state

  const [isExporting, setIsExporting] = useState(false)

  const topProcesses = getTopProcesses(processes, 5)
  const requiredWorkflows = calculateRequiredWorkflows(automationScenarios)
  const selectedPkg = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[1]
  const roi = calculateROI(processes, automationScenarios, hourlyRate, selectedPkg.price)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(state)
      showToast('PDF erfolgreich exportiert', 'success')
    } catch (error) {
      showToast('PDF-Export fehlgeschlagen: ' + error.message, 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    const success = exportAsJSON(state, `workshop-${customer.name}-${new Date().toISOString().split('T')[0]}.json`)
    if (success) {
      showToast('JSON erfolgreich exportiert', 'success')
    } else {
      showToast('JSON-Export fehlgeschlagen', 'error')
    }
  }

  const handleExportCSV = () => {
    const success = exportAsCSV(processes, `prozesse-${customer.name}-${new Date().toISOString().split('T')[0]}.csv`)
    if (success) {
      showToast('CSV erfolgreich exportiert', 'success')
    } else {
      showToast('CSV-Export fehlgeschlagen', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Workshop-Zusammenfassung</h2>
        <p className="mt-2 text-neutral-600">
          Ihre vollständige Workshop-Dokumentation und Export-Optionen.
        </p>
      </div>

      {/* Customer Info */}
      <Card title="Kundeninformationen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-600 mb-1">Unternehmen</h4>
            <p className="text-lg font-semibold">{customer.name || 'Nicht erfasst'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-600 mb-1">Branche</h4>
            <p className="text-lg font-semibold">{customer.industry || 'Nicht erfasst'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-600 mb-1">Mitarbeiter</h4>
            <p className="text-lg font-semibold">{customer.employees || 'Nicht erfasst'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-600 mb-1">Workshop-Datum</h4>
            <p className="text-lg font-semibold">
              {customer.date ? new Date(customer.date).toLocaleDateString('de-DE') : 'Nicht erfasst'}
            </p>
          </div>
        </div>

        {customer.participants.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-neutral-600 mb-2">Teilnehmer</h4>
            <div className="flex flex-wrap gap-2">
              {customer.participants.map((p, i) => (
                <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded text-sm">
                  {p.name} ({p.role})
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Key Metrics */}
      <Card title="Wichtigste Kennzahlen">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
            <div className="text-4xl font-bold text-primary mb-2">{processes.length}</div>
            <div className="text-sm text-neutral-600">Erfasste Prozesse</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-4xl font-bold text-success mb-2">{formatNumber(roi.averageTimeSavings, 0)}h</div>
            <div className="text-sm text-neutral-600">Zeitersparnis/Jahr</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-4xl font-bold text-blue-600 mb-2">{formatNumber(roi.averageROI, 0)}%</div>
            <div className="text-sm text-neutral-600">ROI (Average)</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-4xl font-bold text-purple-600 mb-2">{formatNumber(roi.averageAmortization, 1)}</div>
            <div className="text-sm text-neutral-600">Monate bis ROI</div>
          </div>
        </div>
      </Card>

      {/* Top 5 Processes */}
      {topProcesses.length > 0 && (
        <Card title="Top 5 Prozesse (höchste Priorität)">
          <div className="space-y-3">
            {topProcesses.map((process, index) => (
              <div key={process.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{process.name}</h4>
                    <p className="text-sm text-neutral-600">{process.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">Score: {process.score}/12</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Package & Investment */}
      <Card title="Empfohlenes Paket & Investition">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-primary-50 border-2 border-primary rounded-xl">
            <h3 className="text-2xl font-bold text-primary mb-4">{selectedPkg.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Workflows:</span>
                <span className="font-semibold">{selectedPkg.workflows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Executions/Jahr:</span>
                <span className="font-semibold">{(selectedPkg.executions / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Investition:</span>
                <span className="font-semibold text-xl">{formatCurrency(selectedPkg.price)}/Jahr</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-50 border-2 border-success rounded-xl">
            <h3 className="text-2xl font-bold text-success mb-4">ROI-Prognose</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Zeitersparnis:</span>
                <span className="font-semibold">{formatNumber(roi.averageTimeSavings, 0)}h/Jahr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Kosteneinsparung:</span>
                <span className="font-semibold">{formatCurrency(roi.averageCostSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">ROI:</span>
                <span className="font-semibold text-xl">{formatNumber(roi.averageROI, 0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card title="Export & Aktionen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleExportPDF}
            icon={Download}
            disabled={isExporting}
            size="lg"
          >
            {isExporting ? 'Exportiert...' : 'PDF-Report exportieren'}
          </Button>

          <Button
            onClick={handleExportJSON}
            variant="outline"
            icon={Download}
            size="lg"
          >
            JSON exportieren
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            icon={FileText}
            size="lg"
          >
            Prozesse als CSV exportieren
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            icon={Printer}
            size="lg"
          >
            Seite drucken
          </Button>
        </div>

        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-neutral-900 mb-3">Nächste Schritte</h4>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>Exportieren Sie den PDF-Report für Ihre Unterlagen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>Vereinbaren Sie einen Termin mit Cynefa für die Detailbesprechung</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">3.</span>
              <span>Planen Sie die Implementierung der Quick Wins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">4.</span>
              <span>Erstellen Sie einen Projektplan für die Umsetzung</span>
            </li>
          </ol>
        </div>
      </Card>

      {/* Statistics */}
      <Card title="Workshop-Statistik">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-900">{tools.length}</div>
            <div className="text-xs text-neutral-600">Tools erfasst</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-900">{processes.length}</div>
            <div className="text-xs text-neutral-600">Prozesse erfasst</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-900">{automationScenarios.length}</div>
            <div className="text-xs text-neutral-600">Szenarien definiert</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-900">{requiredWorkflows}</div>
            <div className="text-xs text-neutral-600">Workflows benötigt</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-neutral-900">
              {new Set(processes.map(p => p.department)).size}
            </div>
            <div className="text-xs text-neutral-600">Abteilungen betroffen</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Step8_Summary
