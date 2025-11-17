import React, { useState } from 'react'
import { ListChecks, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Info, CheckCircle } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import StepBanner from '../StepBanner'
import { useWorkshop } from '../../context/WorkshopContext'
import { DEPARTMENTS, FREQUENCIES, ERROR_LEVELS, AUTOMATABLE_LEVELS } from '../../utils/constants'
import { calculateTimePerWeek, calculateTimePerYear, calculateProcessScore, getScoreBadge, getScoreColor } from '../../utils/calculations'

const Step3_ProcessCapture = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { processes, tools } = state

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    description: '',
    tools: [],
    frequency: 'Täglich',
    timePerExecution: '',
    executionsPerPeriod: '',
    errorProneness: 2,
    automatable: 2
  })

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      description: '',
      tools: [],
      frequency: 'Täglich',
      timePerExecution: '',
      executionsPerPeriod: '',
      errorProneness: 2,
      automatable: 2
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const processData = {
      ...formData,
      timePerExecution: parseInt(formData.timePerExecution),
      executionsPerPeriod: parseInt(formData.executionsPerPeriod)
    }

    if (editingId) {
      dispatch({
        type: Actions.UPDATE_PROCESS,
        payload: { id: editingId, updates: processData }
      })
    } else {
      dispatch({ type: Actions.ADD_PROCESS, payload: processData })
    }

    resetForm()
  }

  const handleEdit = (process) => {
    setFormData({
      name: process.name,
      department: process.department,
      description: process.description,
      tools: process.tools,
      frequency: process.frequency,
      timePerExecution: process.timePerExecution.toString(),
      executionsPerPeriod: process.executionsPerPeriod.toString(),
      errorProneness: process.errorProneness,
      automatable: process.automatable
    })
    setEditingId(process.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Möchten Sie diesen Prozess wirklich löschen?')) {
      dispatch({ type: Actions.REMOVE_PROCESS, payload: id })
    }
  }

  const handleToolToggle = (toolName) => {
    if (formData.tools.includes(toolName)) {
      setFormData({ ...formData, tools: formData.tools.filter(t => t !== toolName) })
    } else {
      setFormData({ ...formData, tools: [...formData.tools, toolName] })
    }
  }

  // Sort processes by score
  const sortedProcesses = [...processes].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <StepBanner
        title="Prozess-Erfassung"
        emoji="📋"
        description="Welche manuellen Prozesse laufen in Ihrem Unternehmen?"
        steps={[
          'Klicken Sie auf "Neuen Prozess erfassen"',
          'Beschreiben Sie den aktuellen Ablauf (IST-Zustand)',
          'Bewerten Sie Zeitaufwand und Automatisierbarkeit',
          'Erfassen Sie 3-5 wichtige Prozesse für beste Ergebnisse'
        ]}
      />

      {/* Progress Indicator */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${processes.length >= 3 ? 'bg-green-50 text-success' : 'bg-neutral-100 text-neutral-500'}`}>
          {processes.length >= 3 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="font-medium text-sm">{processes.length} Prozesse erfasst</span>
        </div>
        {processes.length >= 3 && (
          <div className="text-sm text-success font-medium">✓ Genug für gute Analyse!</div>
        )}
      </div>

      {/* Add Process Button */}
      {!showForm && (
        <div>
          <Button
            onClick={() => setShowForm(true)}
            icon={Plus}
            size="lg"
            fullWidth
          >
            + Neuen Prozess erfassen
          </Button>
        </div>
      )}

      {/* Add/Edit Process Form */}
      {showForm && (
        <Card title={editingId ? 'Prozess bearbeiten' : 'Neuen Prozess erfassen'}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prozessname"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Bestelleingang in CRM übertragen"
                required
                helpText="Min. 10 Zeichen für aussagekräftigen Namen"
              />

              <Select
                label="Abteilung"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={DEPARTMENTS}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                IST-Beschreibung (Schritt für Schritt) <span className="text-error">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                rows="5"
                placeholder="1. Schritt 1&#10;2. Schritt 2&#10;3. Schritt 3"
                required
              />
              <p className="text-sm text-neutral-500 mt-1">Min. 20 Zeichen</p>
            </div>

            {/* Beteiligte Tools */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Beteiligte Tools <span className="text-error">*</span>
              </label>
              {tools.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tools.map((tool) => (
                    <label
                      key={tool.id}
                      className={`
                        flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                        ${formData.tools.includes(tool.name)
                          ? 'bg-primary-50 border-primary'
                          : 'bg-white border-neutral-200 hover:border-primary'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.tools.includes(tool.name)}
                        onChange={() => handleToolToggle(tool.name)}
                        className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{tool.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Bitte erfassen Sie zuerst Tools in Schritt 2
                </p>
              )}
            </div>

            {/* Frequency & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Häufigkeit"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                options={FREQUENCIES}
                required
              />

              <Input
                label="Zeitaufwand pro Durchlauf (Minuten)"
                type="number"
                value={formData.timePerExecution}
                onChange={(e) => setFormData({ ...formData, timePerExecution: e.target.value })}
                placeholder="z.B. 5"
                required
                min="1"
              />

              <Input
                label={`Anzahl Durchläufe pro ${formData.frequency === 'Täglich' ? 'Tag' : formData.frequency === 'Wöchentlich' ? 'Woche' : 'Monat'}`}
                type="number"
                value={formData.executionsPerPeriod}
                onChange={(e) => setFormData({ ...formData, executionsPerPeriod: e.target.value })}
                placeholder="z.B. 10"
                required
                min="1"
              />
            </div>

            {/* Time Calculation Preview */}
            {formData.timePerExecution && formData.executionsPerPeriod && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Berechnete Zeitaufwände:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Pro Woche: </span>
                    <span className="font-semibold">
                      {calculateTimePerWeek({
                        timePerExecution: parseInt(formData.timePerExecution),
                        executionsPerPeriod: parseInt(formData.executionsPerPeriod),
                        frequency: formData.frequency
                      }).toFixed(1)} Stunden
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Pro Jahr: </span>
                    <span className="font-semibold">
                      {calculateTimePerYear({
                        timePerExecution: parseInt(formData.timePerExecution),
                        executionsPerPeriod: parseInt(formData.executionsPerPeriod),
                        frequency: formData.frequency
                      }).toFixed(0)} Stunden
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Fehleranfälligkeit
                </label>
                <div className="space-y-2">
                  {ERROR_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${formData.errorProneness === level.value
                          ? 'bg-primary-50 border-primary'
                          : 'bg-white border-neutral-200 hover:border-primary'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="errorProneness"
                        value={level.value}
                        checked={formData.errorProneness === level.value}
                        onChange={(e) => setFormData({ ...formData, errorProneness: parseInt(e.target.value) })}
                        className="w-4 h-4 text-primary border-neutral-300 focus:ring-primary"
                      />
                      <span className={`font-medium ${level.color}`}>{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Automatisierbarkeit
                </label>
                <div className="space-y-2">
                  {AUTOMATABLE_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${formData.automatable === level.value
                          ? 'bg-primary-50 border-primary'
                          : 'bg-white border-neutral-200 hover:border-primary'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="automatable"
                        value={level.value}
                        checked={formData.automatable === level.value}
                        onChange={(e) => setFormData({ ...formData, automatable: parseInt(e.target.value) })}
                        className="w-4 h-4 text-primary border-neutral-300 focus:ring-primary"
                      />
                      <span className={`font-medium ${level.color}`}>{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="submit">
                {editingId ? 'Änderungen speichern' : 'Prozess hinzufügen'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Processes List */}
      {sortedProcesses.length > 0 ? (
        <Card title={`Erfasste Prozesse (${sortedProcesses.length})`}>
          <div className="space-y-3">
            {sortedProcesses.map((process, index) => {
              const timePerWeek = calculateTimePerWeek(process)
              const timePerYear = calculateTimePerYear(process)
              const score = process.score || calculateProcessScore(process)

              return (
                <div
                  key={process.id}
                  className={`p-4 rounded-lg border-2 transition-all ${getScoreColor(score)} border-current`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getScoreBadge(score)}</span>
                        <div>
                          <h3 className="font-semibold text-neutral-900 text-lg">
                            {index + 1}. {process.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-white rounded">
                              {process.department}
                            </span>
                            <span className="text-xs px-2 py-1 bg-white rounded">
                              {process.frequency}
                            </span>
                            <span className="text-xs px-2 py-1 bg-white rounded font-mono">
                              Score: {score}/12
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-700 whitespace-pre-wrap mb-3">
                        {process.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-neutral-600">Zeit/Woche:</span>
                          <div className="font-semibold">{timePerWeek.toFixed(1)}h</div>
                        </div>
                        <div>
                          <span className="text-neutral-600">Zeit/Jahr:</span>
                          <div className="font-semibold">{timePerYear.toFixed(0)}h</div>
                        </div>
                        <div>
                          <span className="text-neutral-600">Tools:</span>
                          <div className="font-semibold">{process.tools.length}</div>
                        </div>
                        <div>
                          <span className="text-neutral-600">Durchläufe:</span>
                          <div className="font-semibold">{process.executionsPerPeriod}</div>
                        </div>
                      </div>

                      {process.tools.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {process.tools.map((toolName, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-primary-100 text-primary rounded"
                            >
                              {toolName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => handleEdit(process)}
                        ariaLabel="Bearbeiten"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(process.id)}
                        ariaLabel="Löschen"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12 text-neutral-500">
            <ListChecks className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Noch keine Prozesse erfasst. Fügen Sie Prozesse hinzu, um zu beginnen.</p>
          </div>
        </Card>
      )}

      {/* Summary */}
      {sortedProcesses.length > 0 && (
        <Card title="Statistik">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">{sortedProcesses.length}</div>
              <div className="text-sm text-neutral-600">Gesamt Prozesse</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {sortedProcesses.filter(p => (p.score || 0) >= 10).length}
              </div>
              <div className="text-sm text-neutral-600">Hohe Priorität</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-success">
                {sortedProcesses.reduce((sum, p) => sum + calculateTimePerYear(p), 0).toFixed(0)}h
              </div>
              <div className="text-sm text-neutral-600">Gesamt Zeit/Jahr</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {new Set(sortedProcesses.map(p => p.department)).size}
              </div>
              <div className="text-sm text-neutral-600">Abteilungen</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step3_ProcessCapture
