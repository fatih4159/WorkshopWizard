import React, { useState, useEffect } from 'react'
import { Zap, Plus, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { useWorkshop } from '../../context/WorkshopContext'
import { COMPLEXITY_LEVELS, CONFIDENCE_LEVELS } from '../../utils/constants'
import { getTopProcesses, calculateTimePerYear } from '../../utils/calculations'

const Step4_AutomationScenarios = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { processes, automationScenarios } = state

  const topProcesses = getTopProcesses(processes, 5)

  const getScenario = (processId) => {
    return automationScenarios.find(s => s.processId === processId)
  }

  const handleUpdateScenario = (processId, field, value) => {
    const existingScenario = getScenario(processId)

    const updates = { [field]: value }

    if (existingScenario) {
      dispatch({
        type: Actions.UPDATE_AUTOMATION_SCENARIO,
        payload: { id: existingScenario.id, updates }
      })
    } else {
      dispatch({
        type: Actions.ADD_AUTOMATION_SCENARIO,
        payload: {
          processId,
          sollDescription: '',
          timeSavingsPercent: 80,
          complexity: 'medium',
          workflowsNeeded: 1,
          confidence: 'probable',
          ...updates
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Automatisierungsszenarien</h2>
        <p className="mt-2 text-neutral-600">
          Definieren Sie, wie die Top-5-Prozesse automatisiert werden können.
        </p>
      </div>

      {topProcesses.length > 0 ? (
        <div className="space-y-6">
          {topProcesses.map((process, index) => {
            const scenario = getScenario(process.id) || {}
            const timePerYear = calculateTimePerYear(process)
            const estimatedSavings = timePerYear * ((scenario.timeSavingsPercent || 0) / 100)

            return (
              <Card
                key={process.id}
                title={`#${index + 1}: ${process.name}`}
                subtitle={`${process.department} • Score: ${process.score}/12`}
              >
                <div className="space-y-6">
                  {/* IST vs SOLL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                        <span className="text-error">IST-Zustand</span>
                      </h4>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                          {process.description}
                        </p>
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="text-sm font-semibold text-error">
                            Zeitaufwand: {timePerYear.toFixed(0)}h/Jahr
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-primary" />
                        <span className="text-success">SOLL-Zustand (automatisiert)</span>
                      </h4>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <textarea
                          value={scenario.sollDescription || ''}
                          onChange={(e) => handleUpdateScenario(process.id, 'sollDescription', e.target.value)}
                          className="block w-full bg-white rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                          rows="5"
                          placeholder="Beschreiben Sie, wie der Prozess automatisiert ablaufen soll..."
                        />
                        {estimatedSavings > 0 && (
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-sm font-semibold text-success">
                              Zeitersparnis: {estimatedSavings.toFixed(0)}h/Jahr ({scenario.timeSavingsPercent}%)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Geschätzte Zeitersparnis (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={scenario.timeSavingsPercent || 80}
                        onChange={(e) => handleUpdateScenario(process.id, 'timeSavingsPercent', parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-neutral-500">0%</span>
                        <span className="text-2xl font-bold text-primary">{scenario.timeSavingsPercent || 80}%</span>
                        <span className="text-neutral-500">100%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Benötigte Workflows
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={scenario.workflowsNeeded || 1}
                        onChange={(e) => handleUpdateScenario(process.id, 'workflowsNeeded', parseInt(e.target.value))}
                        className="block w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <Select
                      label="Komplexität"
                      value={scenario.complexity || 'medium'}
                      onChange={(e) => handleUpdateScenario(process.id, 'complexity', e.target.value)}
                      options={COMPLEXITY_LEVELS.map(l => ({ value: l.value, label: l.label }))}
                    />

                    <Select
                      label="Confidence Level"
                      value={scenario.confidence || 'probable'}
                      onChange={(e) => handleUpdateScenario(process.id, 'confidence', e.target.value)}
                      options={CONFIDENCE_LEVELS.map(l => ({ value: l.value, label: l.label }))}
                    />
                  </div>

                  {/* Complexity Info */}
                  {scenario.complexity && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-neutral-700">
                        <strong>Geschätzte Umsetzungszeit: </strong>
                        {COMPLEXITY_LEVELS.find(l => l.value === scenario.complexity)?.estimatedWeeks} Wochen
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12 text-neutral-500">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Bitte erfassen Sie zuerst Prozesse in Schritt 3.</p>
          </div>
        </Card>
      )}

      {/* Summary */}
      {topProcesses.length > 0 && automationScenarios.length > 0 && (
        <Card title="Zusammenfassung">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {automationScenarios.reduce((sum, s) => sum + (s.workflowsNeeded || 0), 0)}
              </div>
              <div className="text-sm text-neutral-600">Workflows benötigt</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-success">
                {Math.round(automationScenarios.reduce((sum, s) => sum + (s.timeSavingsPercent || 0), 0) / automationScenarios.length)}%
              </div>
              <div className="text-sm text-neutral-600">Ø Zeitersparnis</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {automationScenarios.filter(s => s.complexity === 'low').length}
              </div>
              <div className="text-sm text-neutral-600">Quick Wins</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {automationScenarios.filter(s => s.confidence === 'certain').length}
              </div>
              <div className="text-sm text-neutral-600">Sicher umsetzbar</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step4_AutomationScenarios
