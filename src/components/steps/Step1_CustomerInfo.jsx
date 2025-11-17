import React, { useState } from 'react'
import { Building2, Users, Calendar, Plus, Trash2, CheckCircle, Info } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { useWorkshop } from '../../context/WorkshopContext'
import { INDUSTRIES } from '../../utils/constants'

const Step1_CustomerInfo = () => {
  const { state, dispatch, Actions } = useWorkshop()
  const { customer } = state

  const [newParticipant, setNewParticipant] = useState({ name: '', role: '' })

  const handleCustomerChange = (field, value) => {
    dispatch({
      type: Actions.UPDATE_CUSTOMER,
      payload: { [field]: value }
    })
  }

  const handleAddParticipant = () => {
    if (newParticipant.name.trim() && newParticipant.role.trim()) {
      dispatch({
        type: Actions.UPDATE_CUSTOMER,
        payload: {
          participants: [...customer.participants, { ...newParticipant, id: Date.now().toString() }]
        }
      })
      setNewParticipant({ name: '', role: '' })
    }
  }

  const handleRemoveParticipant = (index) => {
    dispatch({
      type: Actions.UPDATE_CUSTOMER,
      payload: {
        participants: customer.participants.filter((_, i) => i !== index)
      }
    })
  }

  // Check completion
  const isCompanyInfoComplete = customer.name && customer.industry && customer.employees > 0
  const isParticipantsComplete = customer.participants.length > 0
  const isStepComplete = isCompanyInfoComplete && isParticipantsComplete

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-soft-lg">
        <h2 className="text-3xl font-bold mb-2">Willkommen beim Workshop Wizard! 👋</h2>
        <p className="text-lg opacity-90 mb-4">
          Lassen Sie uns gemeinsam Ihr Automatisierungspotenzial entdecken.
        </p>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
          <p className="text-sm font-medium mb-2">So funktioniert's:</p>
          <ol className="text-sm space-y-1 opacity-90">
            <li>1️⃣ Erfassen Sie Ihre Firmendaten (2 Minuten)</li>
            <li>2️⃣ Fügen Sie Workshop-Teilnehmer hinzu</li>
            <li>3️⃣ Klicken Sie auf "Weiter" unten rechts</li>
          </ol>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isCompanyInfoComplete ? 'bg-green-50 text-success' : 'bg-neutral-100 text-neutral-500'}`}>
          {isCompanyInfoComplete ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="font-medium text-sm">Firmendaten</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isParticipantsComplete ? 'bg-green-50 text-success' : 'bg-neutral-100 text-neutral-500'}`}>
          {isParticipantsComplete ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="font-medium text-sm">Teilnehmer</span>
        </div>
      </div>

      {/* Company Info Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">1</span>
            <span>Unternehmensdaten</span>
          </div>
        }
      >
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-primary rounded">
          <p className="text-sm text-neutral-700">
            <Info className="w-4 h-4 inline mr-1" />
            Diese Informationen helfen uns, den Workshop individuell auf Ihr Unternehmen zuzuschneiden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Firmenname"
            value={customer.name}
            onChange={(e) => handleCustomerChange('name', e.target.value)}
            placeholder="z.B. Mustermann GmbH"
            icon={Building2}
            required
            helpText="Der vollständige Name Ihres Unternehmens"
          />

          <Select
            label="Branche"
            value={customer.industry}
            onChange={(e) => handleCustomerChange('industry', e.target.value)}
            options={INDUSTRIES}
            placeholder="Bitte wählen..."
            required
            helpText="Wählen Sie die Hauptbranche Ihres Unternehmens"
          />

          <Input
            label="Anzahl Mitarbeiter"
            type="number"
            value={customer.employees || ''}
            onChange={(e) => handleCustomerChange('employees', parseInt(e.target.value) || 0)}
            placeholder="z.B. 50"
            icon={Users}
            required
            min="1"
            helpText="Ungefähre Anzahl der Mitarbeiter"
          />

          <Input
            label="Workshop-Datum"
            type="date"
            value={customer.date}
            onChange={(e) => handleCustomerChange('date', e.target.value)}
            icon={Calendar}
            required
            helpText="Datum des heutigen Workshops"
          />
        </div>

        {isCompanyInfoComplete && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm text-success font-medium">Firmendaten vollständig! ✓</span>
          </div>
        )}
      </Card>

      {/* Participants Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">2</span>
            <span>Workshop-Teilnehmer</span>
          </div>
        }
      >
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-primary rounded">
          <p className="text-sm text-neutral-700">
            <Info className="w-4 h-4 inline mr-1" />
            Wer nimmt am Workshop teil? Fügen Sie alle Personen hinzu (mind. 1 Person).
          </p>
        </div>

        {/* Existing Participants */}
        {customer.participants.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-neutral-900 mb-3">Hinzugefügte Teilnehmer ({customer.participants.length})</h4>
            <div className="space-y-2">
              {customer.participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{participant.name}</p>
                      <p className="text-sm text-neutral-600">{participant.role}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleRemoveParticipant(index)}
                    ariaLabel={`${participant.name} entfernen`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Participant */}
        <div className="space-y-4 p-4 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-neutral-900">Teilnehmer hinzufügen</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              placeholder="z.B. Max Mustermann"
              helpText="Vor- und Nachname"
            />
            <Input
              label="Rolle/Position"
              value={newParticipant.role}
              onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
              placeholder="z.B. Geschäftsführer"
              helpText="Position im Unternehmen"
            />
          </div>
          <Button
            onClick={handleAddParticipant}
            icon={Plus}
            disabled={!newParticipant.name.trim() || !newParticipant.role.trim()}
            fullWidth
          >
            Teilnehmer hinzufügen
          </Button>
        </div>

        {customer.participants.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Bitte fügen Sie mindestens einen Teilnehmer hinzu, um fortzufahren.
            </p>
          </div>
        )}

        {isParticipantsComplete && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm text-success font-medium">Teilnehmer hinzugefügt! ✓</span>
          </div>
        )}
      </Card>

      {/* Success Summary Card */}
      {isStepComplete && (
        <Card title="✅ Alles erledigt!">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-success">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">Workshop-Übersicht</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Firma:</span>
                <p className="font-semibold text-neutral-900">{customer.name}</p>
              </div>
              <div>
                <span className="text-neutral-600">Branche:</span>
                <p className="font-semibold text-neutral-900">{customer.industry}</p>
              </div>
              <div>
                <span className="text-neutral-600">Mitarbeiter:</span>
                <p className="font-semibold text-neutral-900">{customer.employees}</p>
              </div>
              <div>
                <span className="text-neutral-600">Datum:</span>
                <p className="font-semibold text-neutral-900">
                  {new Date(customer.date).toLocaleDateString('de-DE')}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-neutral-600">Teilnehmer:</span>
                <p className="font-semibold text-neutral-900">
                  {customer.participants.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-neutral-700 mb-2">
                <strong>Nächster Schritt:</strong> Klicken Sie unten rechts auf "Weiter", um Ihre Tool-Landscape zu erfassen.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step1_CustomerInfo
