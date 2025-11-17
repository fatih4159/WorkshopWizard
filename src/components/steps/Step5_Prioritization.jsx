import React from 'react'
import { BarChart3 } from 'lucide-react'
import Card from '../ui/Card'
import StepBanner from '../StepBanner'
import { useWorkshop } from '../../context/WorkshopContext'
import { sortProcessesByScore, calculateTimePerWeek, calculateTimePerYear, getScoreBadge, getScoreColor } from '../../utils/calculations'

const Step5_Prioritization = () => {
  const { state } = useWorkshop()
  const { processes } = state

  const sortedProcesses = sortProcessesByScore(processes)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <StepBanner
        title="Priorisierung"
        emoji="📊"
        description="Welche Prozesse haben das größte Automatisierungspotenzial?"
        steps={[
          'Wir haben Ihre Prozesse automatisch bewertet (Score 0-12)',
          'Prozesse mit hohem Score = hohe Priorität',
          'Top 5 sind die wichtigsten Kandidaten',
          'Berücksichtigt: Häufigkeit, Zeitaufwand, Fehleranfälligkeit, Automatisierbarkeit'
        ]}
      />

      {sortedProcesses.length > 0 ? (
        <>
          {/* Priority Matrix Table */}
          <Card title="Priorisierungs-Matrix">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-100 border-b-2 border-neutral-200">
                    <th className="text-left p-3 font-semibold">Rang</th>
                    <th className="text-left p-3 font-semibold">Prozess</th>
                    <th className="text-left p-3 font-semibold">Abteilung</th>
                    <th className="text-center p-3 font-semibold">Häufigkeit</th>
                    <th className="text-right p-3 font-semibold">Zeit/Woche</th>
                    <th className="text-right p-3 font-semibold">Zeit/Jahr</th>
                    <th className="text-center p-3 font-semibold">Fehler</th>
                    <th className="text-center p-3 font-semibold">Auto.</th>
                    <th className="text-center p-3 font-semibold">Score</th>
                    <th className="text-center p-3 font-semibold">Priorität</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProcesses.map((process, index) => {
                    const timePerWeek = calculateTimePerWeek(process)
                    const timePerYear = calculateTimePerYear(process)
                    const score = process.score || 0

                    return (
                      <tr
                        key={process.id}
                        className={`border-b border-neutral-200 hover:bg-neutral-50 ${index < 5 ? 'bg-green-50' : ''}`}
                      >
                        <td className="p-3 font-bold">{index + 1}</td>
                        <td className="p-3 font-medium">{process.name}</td>
                        <td className="p-3">{process.department}</td>
                        <td className="p-3 text-center">
                          <span className="text-xs px-2 py-1 bg-neutral-200 rounded">
                            {process.frequency}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">{timePerWeek.toFixed(1)}h</td>
                        <td className="p-3 text-right font-mono">{timePerYear.toFixed(0)}h</td>
                        <td className="p-3 text-center">{process.errorProneness}/3</td>
                        <td className="p-3 text-center">{process.automatable}/3</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full font-bold ${getScoreColor(score)}`}>
                            {score}
                          </span>
                        </td>
                        <td className="p-3 text-center text-2xl">{getScoreBadge(score)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top 5 Highlight */}
          <Card title="Top 5 Prozesse (höchste Priorität)">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProcesses.slice(0, 5).map((process, index) => {
                const score = process.score || 0
                const timePerYear = calculateTimePerYear(process)

                return (
                  <div
                    key={process.id}
                    className={`p-4 rounded-lg border-2 ${getScoreColor(score)} border-current`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{getScoreBadge(score)}</span>
                      <span className="text-2xl font-bold">#{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-neutral-900 mb-1">{process.name}</h4>
                    <p className="text-sm text-neutral-600 mb-2">{process.department}</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Score:</span>
                        <span className="font-bold">{score}/12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Zeit/Jahr:</span>
                        <span className="font-bold">{timePerYear.toFixed(0)}h</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Statistics */}
          <Card title="Statistik">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">
                  {sortedProcesses.filter(p => (p.score || 0) >= 10).length}
                </div>
                <div className="text-sm text-neutral-600">Hohe Priorität (≥10)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {sortedProcesses.filter(p => (p.score || 0) >= 8 && (p.score || 0) < 10).length}
                </div>
                <div className="text-sm text-neutral-600">Mittlere Priorität (8-9)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-success">
                  {sortedProcesses.filter(p => (p.score || 0) >= 6 && (p.score || 0) < 8).length}
                </div>
                <div className="text-sm text-neutral-600">Niedrige Priorität (6-7)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {sortedProcesses.reduce((sum, p) => sum + calculateTimePerYear(p), 0).toFixed(0)}h
                </div>
                <div className="text-sm text-neutral-600">Gesamt Zeit/Jahr</div>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12 text-neutral-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Bitte erfassen Sie zuerst Prozesse in Schritt 3.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step5_Prioritization
