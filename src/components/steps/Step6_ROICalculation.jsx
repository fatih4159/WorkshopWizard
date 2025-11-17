import React, { useState } from 'react'
import { TrendingUp, DollarSign, Calendar } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import { useWorkshop } from '../../context/WorkshopContext'
import { calculateROI, formatCurrency, formatNumber } from '../../utils/calculations'
import { DEFAULT_HOURLY_RATE, PACKAGES } from '../../utils/constants'

const Step6_ROICalculation = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { processes, automationScenarios, hourlyRate, selectedPackage, customPackages } = state

  // Use custom packages if available, otherwise use defaults
  const packages = customPackages || PACKAGES

  const [localHourlyRate, setLocalHourlyRate] = useState(hourlyRate || DEFAULT_HOURLY_RATE)

  const handleRateChange = (value) => {
    setLocalHourlyRate(value)
    dispatch({ type: Actions.SET_HOURLY_RATE, payload: value })
  }

  const selectedPkg = packages.find(p => p.id === selectedPackage) || packages[1]
  const roi = calculateROI(processes, automationScenarios, localHourlyRate, selectedPkg.price)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">ROI-Berechnung</h2>
        <p className="mt-2 text-neutral-600">
          Automatische Berechnung des Return on Investment für die geplanten Automatisierungen.
        </p>
      </div>

      {automationScenarios.length > 0 ? (
        <>
          {/* Configuration */}
          <Card title="Kalkulationsgrundlagen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Stundensatz (€/Stunde)
                </label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={localHourlyRate}
                  onChange={(e) => handleRateChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">€5</span>
                  <span className="text-2xl font-bold text-primary font-mono">€{localHourlyRate}</span>
                  <span className="text-neutral-500">€80</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ausgewähltes Paket
                </label>
                <div className="p-4 bg-primary-50 border-2 border-primary rounded-lg">
                  <h4 className="font-bold text-primary text-lg">{selectedPkg.name}</h4>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    {formatCurrency(selectedPkg.price)}/Jahr
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {selectedPkg.workflows} Workflows • {(selectedPkg.executions / 1000).toFixed(0)}k Executions
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* ROI Dashboard */}
          <Card title="ROI-Ergebnisse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Average Case */}
              <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary">
                <h3 className="text-sm font-semibold text-primary mb-2">AVERAGE CASE</h3>
                <div className="text-4xl font-bold text-neutral-900 mb-4">
                  {formatNumber(roi.averageROI, 0)}%
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Zeitersparnis:</span>
                    <span className="font-semibold">{formatNumber(roi.averageTimeSavings, 0)}h/Jahr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Kosteneinsparung:</span>
                    <span className="font-semibold">{formatCurrency(roi.averageCostSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Amortisation:</span>
                    <span className="font-semibold">{formatNumber(roi.averageAmortization, 1)} Monate</span>
                  </div>
                </div>
              </div>

              {/* Best Case */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-success">
                <h3 className="text-sm font-semibold text-success mb-2">BEST CASE</h3>
                <div className="text-4xl font-bold text-neutral-900 mb-4">
                  {formatNumber(roi.bestCaseROI, 0)}%
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Zeitersparnis:</span>
                    <span className="font-semibold">{formatNumber(roi.bestCaseTimeSavings, 0)}h/Jahr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Kosteneinsparung:</span>
                    <span className="font-semibold">{formatCurrency(roi.bestCaseCostSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Amortisation:</span>
                    <span className="font-semibold">{formatNumber(roi.bestCaseAmortization, 1)} Monate</span>
                  </div>
                </div>
              </div>

              {/* Worst Case */}
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-warning">
                <h3 className="text-sm font-semibold text-warning mb-2">WORST CASE</h3>
                <div className="text-4xl font-bold text-neutral-900 mb-4">
                  {formatNumber(roi.worstCaseROI, 0)}%
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Zeitersparnis:</span>
                    <span className="font-semibold">{formatNumber(roi.worstCaseTimeSavings, 0)}h/Jahr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Kosteneinsparung:</span>
                    <span className="font-semibold">{formatCurrency(roi.worstCaseCostSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Amortisation:</span>
                    <span className="font-semibold">{formatNumber(roi.worstCaseAmortization, 1)} Monate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="p-6 bg-neutral-100 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-4">Kosten vs. Einsparung (Average Case)</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Investition</span>
                    <span className="font-semibold">{formatCurrency(roi.investment)}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-4">
                    <div
                      className="bg-error h-4 rounded-full"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Kosteneinsparung (Jahr 1)</span>
                    <span className="font-semibold">{formatCurrency(roi.averageCostSavings)}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-4">
                    <div
                      className="bg-success h-4 rounded-full"
                      style={{ width: `${Math.min((roi.averageCostSavings / roi.investment) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {roi.averageROI > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-neutral-700">
                    <strong>✓ Positive Rendite: </strong>
                    Die Investition amortisiert sich nach ca. {formatNumber(roi.averageAmortization, 1)} Monaten.
                    Im ersten Jahr ergibt sich ein Gewinn von {formatCurrency(roi.averageCostSavings - roi.investment)}.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Breakdown by Process */}
          <Card title="Detaillierte Aufschlüsselung">
            <div className="space-y-3">
              {automationScenarios.map((scenario) => {
                const process = processes.find(p => p.id === scenario.processId)
                if (!process) return null

                const timePerYear = process.timePerExecution * process.executionsPerPeriod *
                  (process.frequency === 'Täglich' ? 250 : process.frequency === 'Wöchentlich' ? 50 : 12) / 60

                const savings = (timePerYear * (scenario.timeSavingsPercent || 0) / 100)
                const costSavings = savings * localHourlyRate

                return (
                  <div key={scenario.id} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{process.name}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{process.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">
                          {formatCurrency(costSavings)}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {formatNumber(savings, 0)}h/Jahr
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12 text-neutral-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Bitte definieren Sie zuerst Automatisierungsszenarien in Schritt 4.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step6_ROICalculation
