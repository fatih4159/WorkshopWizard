import React, { useState } from 'react'
import { Wrench, Plus, Trash2, CheckCircle, Info, Zap } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useWorkshop } from '../../context/WorkshopContext'
import { POPULAR_TOOLS } from '../../utils/constants'

const Step2_ToolLandscape = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { tools } = state

  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customToolName, setCustomToolName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Alle')

  const handleQuickAddTool = (tool) => {
    // Check if tool already exists
    const exists = tools.some(t => t.name.toLowerCase() === tool.name.toLowerCase())
    if (exists) return

    dispatch({
      type: Actions.ADD_TOOL,
      payload: {
        name: tool.name,
        category: tool.category,
        frequency: 'Täglich',
        hasAPI: tool.hasAPI,
        department: ''
      }
    })
  }

  const handleAddCustomTool = () => {
    if (!customToolName.trim()) return

    dispatch({
      type: Actions.ADD_TOOL,
      payload: {
        name: customToolName,
        category: 'Andere',
        frequency: 'Täglich',
        hasAPI: false,
        department: ''
      }
    })
    setCustomToolName('')
    setShowCustomForm(false)
  }

  const handleRemoveTool = (id) => {
    dispatch({ type: Actions.REMOVE_TOOL, payload: id })
  }

  const isToolAdded = (toolName) => {
    return tools.some(t => t.name.toLowerCase() === toolName.toLowerCase())
  }

  // Group tools by category
  const categories = ['Alle', ...new Set(POPULAR_TOOLS.map(t => t.category))]
  const filteredTools = selectedCategory === 'Alle'
    ? POPULAR_TOOLS
    : POPULAR_TOOLS.filter(t => t.category === selectedCategory)

  const toolsProgress = tools.length

  return (
    <div className="space-y-6">
      {/* Header with Info Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-soft-lg">
        <h2 className="text-3xl font-bold mb-2">Ihre Tool-Landscape 🛠️</h2>
        <p className="text-lg opacity-90 mb-4">
          Welche Software und Tools nutzen Sie in Ihrem Unternehmen?
        </p>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
          <p className="text-sm font-medium mb-2">So geht's:</p>
          <ol className="text-sm space-y-1 opacity-90">
            <li>1️⃣ Klicken Sie auf Tools, die Sie nutzen (grün = ausgewählt)</li>
            <li>2️⃣ Oder fügen Sie eigene Tools hinzu</li>
            <li>3️⃣ Weiter zum nächsten Schritt (min. 2-3 Tools empfohlen)</li>
          </ol>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${toolsProgress >= 3 ? 'bg-green-50 text-success' : 'bg-neutral-100 text-neutral-500'}`}>
          {toolsProgress >= 3 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="font-medium text-sm">{toolsProgress} Tools erfasst</span>
        </div>
      </div>

      {/* Selected Tools Summary */}
      {tools.length > 0 && (
        <Card title={`✅ Ihre ausgewählten Tools (${tools.length})`}>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 border-2 border-success rounded-lg"
              >
                <Wrench className="w-4 h-4 text-success" />
                <span className="font-medium text-neutral-900">{tool.name}</span>
                <button
                  onClick={() => handleRemoveTool(tool.id)}
                  className="ml-2 text-neutral-500 hover:text-error transition-colors"
                  aria-label={`${tool.name} entfernen`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {tools.length >= 3 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm text-success font-medium">Super! Sie können zum nächsten Schritt.</span>
            </div>
          )}
        </Card>
      )}

      {/* Quick Select Tools */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span>Beliebte Tools (Klicken zum Hinzufügen)</span>
          </div>
        }
      >
        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredTools.map((tool, index) => {
            const added = isToolAdded(tool.name)
            return (
              <button
                key={index}
                onClick={() => !added && handleQuickAddTool(tool)}
                disabled={added}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  added
                    ? 'bg-green-50 border-success cursor-not-allowed'
                    : 'bg-white border-neutral-200 hover:border-primary hover:shadow-soft cursor-pointer'
                }`}
              >
                {added && <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />}
                <div className="font-semibold text-sm text-neutral-900">{tool.name}</div>
                <div className="text-xs text-neutral-500 mt-1">{tool.category}</div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Custom Tool Section */}
      <Card title="Tool nicht gefunden?">
        {!showCustomForm ? (
          <Button
            onClick={() => setShowCustomForm(true)}
            icon={Plus}
            variant="outline"
            fullWidth
          >
            Eigenes Tool hinzufügen
          </Button>
        ) : (
          <div className="space-y-4 p-4 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
            <Input
              label="Tool-Name"
              value={customToolName}
              onChange={(e) => setCustomToolName(e.target.value)}
              placeholder="z.B. Mein individuelles Tool"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                onClick={handleAddCustomTool}
                icon={Plus}
                disabled={!customToolName.trim()}
              >
                Hinzufügen
              </Button>
              <Button
                onClick={() => {
                  setShowCustomForm(false)
                  setCustomToolName('')
                }}
                variant="outline"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Help Section */}
      {tools.length === 0 && (
        <Card>
          <div className="p-6 bg-blue-50 border-l-4 border-primary rounded">
            <div className="flex gap-3">
              <Info className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">Tipp: Welche Tools sind wichtig?</h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• CRM-Systeme (z.B. HubSpot, Salesforce)</li>
                  <li>• E-Mail & Kommunikation (z.B. Gmail, Outlook)</li>
                  <li>• Buchhaltung (z.B. Lexoffice, DATEV)</li>
                  <li>• E-Commerce Plattformen (z.B. Shopify)</li>
                  <li>• Projektmanagement (z.B. Asana, Trello)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step2_ToolLandscape
