import React from 'react'
import { Package, Check } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useWorkshop } from '../../context/WorkshopContext'
import { PACKAGES } from '../../utils/constants'
import { calculateRequiredWorkflows, recommendPackage, formatCurrency } from '../../utils/calculations'

const Step7_PackageRecommendation = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { automationScenarios, selectedPackage } = state

  const requiredWorkflows = calculateRequiredWorkflows(automationScenarios)
  const recommendedPackageId = recommendPackage(requiredWorkflows)

  const handleSelectPackage = (packageId) => {
    dispatch({ type: Actions.SET_SELECTED_PACKAGE, payload: packageId })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Paket-Empfehlung</h2>
        <p className="mt-2 text-neutral-600">
          Basierend auf Ihren Anforderungen empfehlen wir das passende Cynefa-Paket.
        </p>
      </div>

      {automationScenarios.length > 0 ? (
        <>
          {/* Requirements Summary */}
          <Card title="Ihre Anforderungen">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{requiredWorkflows}</div>
                <div className="text-sm text-neutral-600">Workflows benötigt</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{automationScenarios.length}</div>
                <div className="text-sm text-neutral-600">Prozesse</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-success">
                  {automationScenarios.filter(s => s.complexity === 'low').length}
                </div>
                <div className="text-sm text-neutral-600">Quick Wins</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {automationScenarios.filter(s => s.complexity === 'high').length}
                </div>
                <div className="text-sm text-neutral-600">Komplex</div>
              </div>
            </div>
          </Card>

          {/* Package Comparison */}
          <Card title="Paket-Vergleich">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg) => {
                const isRecommended = pkg.id === recommendedPackageId
                const isSelected = pkg.id === selectedPackage
                const meetsRequirements = pkg.workflows >= requiredWorkflows

                return (
                  <div
                    key={pkg.id}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all cursor-pointer
                      ${isSelected
                        ? 'border-primary bg-primary-50 shadow-soft-lg'
                        : meetsRequirements
                          ? 'border-green-300 bg-green-50 hover:shadow-soft'
                          : 'border-neutral-200 bg-white opacity-75'
                      }
                    `}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 bg-success text-white text-xs font-bold rounded-full">
                          EMPFOHLEN
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-neutral-900">{pkg.name}</h3>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-primary">{formatCurrency(pkg.price)}</span>
                        <span className="text-neutral-600">/Jahr (netto)</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Workflows:</span>
                        <span className="font-semibold">{pkg.workflows}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Executions/Jahr:</span>
                        <span className="font-semibold">{(pkg.executions / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Custom APIs:</span>
                        <span className="font-semibold">{pkg.customApis}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {!meetsRequirements && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                        <p className="text-xs text-yellow-800">
                          ⚠️ Dieses Paket erfüllt nicht alle Anforderungen ({requiredWorkflows} Workflows benötigt)
                        </p>
                      </div>
                    )}

                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      fullWidth
                      onClick={() => handleSelectPackage(pkg.id)}
                    >
                      {isSelected ? 'Ausgewählt ✓' : 'Auswählen'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Selected Package Details */}
          {selectedPackage && (
            <Card title="Ihr ausgewähltes Paket">
              {(() => {
                const pkg = PACKAGES.find(p => p.id === selectedPackage)
                if (!pkg) return null

                const estimatedWeeks = automationScenarios.reduce((total, s) => {
                  const weeks = s.complexity === 'low' ? 3 : s.complexity === 'medium' ? 5 : 10
                  return total + weeks
                }, 0)

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4">{pkg.name}</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-neutral-600">Investition:</span>
                          <div className="text-2xl font-bold">{formatCurrency(pkg.price)}/Jahr</div>
                        </div>
                        <div>
                          <span className="text-sm text-neutral-600">Workflows inklusive:</span>
                          <div className="text-xl font-semibold">{pkg.workflows}</div>
                        </div>
                        <div>
                          <span className="text-sm text-neutral-600">Geschätzte Umsetzungszeit:</span>
                          <div className="text-xl font-semibold">{Math.ceil(estimatedWeeks / 4)}-{Math.ceil(estimatedWeeks / 3)} Monate</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-neutral-900 mb-3">Nächste Schritte</h4>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary">1.</span>
                          <span>Zusammenfassung im nächsten Schritt ansehen</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary">2.</span>
                          <span>PDF-Report exportieren</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary">3.</span>
                          <span>Termin für Detailbesprechung vereinbaren</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary">4.</span>
                          <span>Implementierung starten</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                )
              })()}
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="text-center py-12 text-neutral-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Bitte definieren Sie zuerst Automatisierungsszenarien in Schritt 4.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step7_PackageRecommendation
