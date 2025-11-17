import React, { useState } from 'react'
import { Building2, Users, Calendar, Plus, Trash2 } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Kundeninformationen</h2>
        <p className="mt-2 text-neutral-600">
          Erfassen Sie grundlegende Informationen über das Unternehmen und die Workshop-Teilnehmer.
        </p>
      </div>

      {/* Company Info Card */}
      <Card title="Unternehmensdaten">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Firmenname"
            value={customer.name}
            onChange={(e) => handleCustomerChange('name', e.target.value)}
            placeholder="z.B. Mustermann GmbH"
            icon={Building2}
            required
          />

          <Select
            label="Branche"
            value={customer.industry}
            onChange={(e) => handleCustomerChange('industry', e.target.value)}
            options={INDUSTRIES}
            placeholder="Bitte wählen..."
            required
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
          />

          <Input
            label="Workshop-Datum"
            type="date"
            value={customer.date}
            onChange={(e) => handleCustomerChange('date', e.target.value)}
            icon={Calendar}
            required
          />
        </div>
      </Card>

      {/* Participants Card */}
      <Card title="Workshop-Teilnehmer">
        {/* Existing Participants */}
        {customer.participants.length > 0 && (
          <div className="mb-6 space-y-2">
            {customer.participants.map((participant, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div>
                  <p className="font-medium text-neutral-900">{participant.name}</p>
                  <p className="text-sm text-neutral-500">{participant.role}</p>
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
        )}

        {/* Add New Participant */}
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-900">Neuen Teilnehmer hinzufügen</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              placeholder="z.B. Max Mustermann"
            />
            <Input
              label="Rolle"
              value={newParticipant.role}
              onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
              placeholder="z.B. Geschäftsführer"
            />
          </div>
          <Button
            onClick={handleAddParticipant}
            icon={Plus}
            disabled={!newParticipant.name.trim() || !newParticipant.role.trim()}
          >
            Teilnehmer hinzufügen
          </Button>
        </div>

        {customer.participants.length === 0 && (
          <p className="text-sm text-neutral-500 mt-4">
            Noch keine Teilnehmer hinzugefügt. Fügen Sie mindestens einen Teilnehmer hinzu.
          </p>
        )}
      </Card>

      {/* Summary Card */}
      {customer.name && customer.industry && customer.participants.length > 0 && (
        <Card title="Zusammenfassung">
          <div className="prose prose-sm max-w-none">
            <p>
              <strong>Firma:</strong> {customer.name} ({customer.industry})
            </p>
            <p>
              <strong>Mitarbeiter:</strong> {customer.employees}
            </p>
            <p>
              <strong>Workshop-Datum:</strong>{' '}
              {new Date(customer.date).toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p>
              <strong>Teilnehmer:</strong> {customer.participants.length} Person(en)
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Step1_CustomerInfo
