import React, { useState } from 'react'
import { Wrench, Plus, Trash2, Edit2, Search } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { useWorkshop } from '../../context/WorkshopContext'
import { TOOL_CATEGORIES, FREQUENCIES, POPULAR_TOOLS } from '../../utils/constants'

const Step2_ToolLandscape = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { tools } = state

  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    department: '',
    frequency: 'Täglich',
    hasAPI: true
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const handleAddTool = () => {
    if (newTool.name.trim() && newTool.category) {
      dispatch({ type: Actions.ADD_TOOL, payload: newTool })
      setNewTool({
        name: '',
        category: '',
        department: '',
        frequency: 'Täglich',
        hasAPI: true
      })
    }
  }

  const handleSelectPopularTool = (tool) => {
    setNewTool({
      ...newTool,
      name: tool.name,
      category: tool.category,
      hasAPI: tool.hasAPI
    })
  }

  const handleRemoveTool = (id) => {
    dispatch({ type: Actions.REMOVE_TOOL, payload: id })
  }

  const filteredPopularTools = POPULAR_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Tool-Landscape</h2>
        <p className="mt-2 text-neutral-600">
          Erfassen Sie alle genutzten Software-Tools und Systeme im Unternehmen.
        </p>
      </div>

      {/* Add Tool Card */}
      <Card title="Neues Tool hinzufügen">
        {/* Popular Tools Quick Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Schnellauswahl (beliebte Tools)
          </label>
          <Input
            placeholder="Tool suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          {searchTerm && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-lg">
              {filteredPopularTools.slice(0, 10).map((tool, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                  onClick={() => {
                    handleSelectPopularTool(tool)
                    setSearchTerm('')
                  }}
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-xs text-neutral-500">
                    {tool.category} • {tool.hasAPI ? 'API verfügbar' : 'Keine API'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tool-Name"
            value={newTool.name}
            onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
            placeholder="z.B. Shopify"
            required
          />

          <Select
            label="Kategorie"
            value={newTool.category}
            onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
            options={TOOL_CATEGORIES}
            required
          />

          <Input
            label="Hauptnutzer (Abteilung)"
            value={newTool.department}
            onChange={(e) => setNewTool({ ...newTool, department: e.target.value })}
            placeholder="z.B. Vertrieb"
          />

          <Select
            label="Nutzungshäufigkeit"
            value={newTool.frequency}
            onChange={(e) => setNewTool({ ...newTool, frequency: e.target.value })}
            options={FREQUENCIES}
          />

          <div className="flex items-center gap-2 col-span-full">
            <input
              type="checkbox"
              id="hasAPI"
              checked={newTool.hasAPI}
              onChange={(e) => setNewTool({ ...newTool, hasAPI: e.target.checked })}
              className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
            />
            <label htmlFor="hasAPI" className="text-sm font-medium text-neutral-700">
              API verfügbar
            </label>
          </div>
        </div>

        <Button
          onClick={handleAddTool}
          icon={Plus}
          disabled={!newTool.name.trim() || !newTool.category}
          className="mt-4"
        >
          Tool hinzufügen
        </Button>
      </Card>

      {/* Tools List */}
      {tools.length > 0 && (
        <Card title={`Erfasste Tools (${tools.length})`}>
          <div className="space-y-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:shadow-soft transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-neutral-900">{tool.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-primary-50 text-primary rounded">
                          {tool.category}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {tool.frequency}
                        </span>
                        {tool.department && (
                          <span className="text-xs text-neutral-500">
                            • {tool.department}
                          </span>
                        )}
                        {tool.hasAPI && (
                          <span className="text-xs px-2 py-1 bg-green-50 text-success rounded">
                            API
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleRemoveTool(tool.id)}
                  ariaLabel={`${tool.name} entfernen`}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tools.length === 0 && (
        <Card>
          <div className="text-center py-12 text-neutral-500">
            <Wrench className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Noch keine Tools erfasst. Fügen Sie Tools hinzu, um zu beginnen.</p>
          </div>
        </Card>
      )}

      {/* Summary */}
      {tools.length > 0 && (
        <Card title="Statistik">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">{tools.length}</div>
              <div className="text-sm text-neutral-600">Gesamt Tools</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-success">
                {tools.filter(t => t.hasAPI).length}
              </div>
              <div className="text-sm text-neutral-600">Mit API</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {tools.filter(t => t.frequency === 'Täglich').length}
              </div>
              <div className="text-sm text-neutral-600">Täglich genutzt</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {new Set(tools.map(t => t.category)).size}
              </div>
              <div className="text-sm text-neutral-600">Kategorien</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step2_ToolLandscape
