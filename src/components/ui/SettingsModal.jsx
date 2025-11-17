import React, { useState, useEffect } from 'react'
import { X, RotateCcw, Plus, Trash2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import { useWorkshop } from '../../context/WorkshopContext'
import { PACKAGES as DEFAULT_PACKAGES } from '../../utils/constants'
import { useToast } from './Toast'

const SettingsModal = ({ isOpen, onClose }) => {
  const { state, dispatch, Actions } = useWorkshop()
  const { showToast } = useToast()

  // Use custom packages if available, otherwise use defaults
  const currentPackages = state.customPackages || DEFAULT_PACKAGES
  const [packages, setPackages] = useState(JSON.parse(JSON.stringify(currentPackages)))

  useEffect(() => {
    // Reset packages when modal opens
    const pkgs = state.customPackages || DEFAULT_PACKAGES
    setPackages(JSON.parse(JSON.stringify(pkgs)))
  }, [isOpen, state.customPackages])

  const handlePackageChange = (packageId, field, value) => {
    setPackages(packages.map(pkg =>
      pkg.id === packageId
        ? { ...pkg, [field]: field === 'price' || field === 'workflows' || field === 'executions' || field === 'customApis'
            ? parseInt(value) || 0
            : value
          }
        : pkg
    ))
  }

  const handleFeatureChange = (packageId, featureIndex, value) => {
    setPackages(packages.map(pkg =>
      pkg.id === packageId
        ? {
            ...pkg,
            features: pkg.features.map((f, i) => i === featureIndex ? value : f)
          }
        : pkg
    ))
  }

  const handleAddFeature = (packageId) => {
    setPackages(packages.map(pkg =>
      pkg.id === packageId
        ? { ...pkg, features: [...pkg.features, 'Neues Feature'] }
        : pkg
    ))
  }

  const handleRemoveFeature = (packageId, featureIndex) => {
    setPackages(packages.map(pkg =>
      pkg.id === packageId
        ? { ...pkg, features: pkg.features.filter((_, i) => i !== featureIndex) }
        : pkg
    ))
  }

  const handleSave = () => {
    dispatch({ type: Actions.SET_CUSTOM_PACKAGES, payload: packages })
    showToast('Paketeinstellungen gespeichert', 'success')
    onClose()
  }

  const handleReset = () => {
    if (window.confirm('Möchten Sie die Paketeinstellungen auf die Standardwerte zurücksetzen?')) {
      setPackages(JSON.parse(JSON.stringify(DEFAULT_PACKAGES)))
      dispatch({ type: Actions.SET_CUSTOM_PACKAGES, payload: null })
      showToast('Paketeinstellungen zurückgesetzt', 'info')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paketeinstellungen" size="xl">
      <div className="space-y-6">
        {/* Reset Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
          >
            Auf Standard zurücksetzen
          </Button>
        </div>

        {/* Packages */}
        <div className="space-y-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border border-neutral-200 rounded-lg p-6 bg-neutral-50">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">{pkg.name}</h3>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Paketname"
                  value={pkg.name}
                  onChange={(e) => handlePackageChange(pkg.id, 'name', e.target.value)}
                />

                <Input
                  label="Preis (€/Jahr)"
                  type="number"
                  value={pkg.price}
                  onChange={(e) => handlePackageChange(pkg.id, 'price', e.target.value)}
                />

                <Input
                  label="Workflows"
                  type="number"
                  value={pkg.workflows}
                  onChange={(e) => handlePackageChange(pkg.id, 'workflows', e.target.value)}
                />

                <Input
                  label="Executions/Jahr"
                  type="number"
                  value={pkg.executions}
                  onChange={(e) => handlePackageChange(pkg.id, 'executions', e.target.value)}
                />

                <Input
                  label="Custom APIs"
                  type="number"
                  value={pkg.customApis}
                  onChange={(e) => handlePackageChange(pkg.id, 'customApis', e.target.value)}
                />
              </div>

              {/* Features */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-neutral-700">
                    Features
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() => handleAddFeature(pkg.id)}
                  >
                    Feature hinzufügen
                  </Button>
                </div>

                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(pkg.id, index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                      <button
                        onClick={() => handleRemoveFeature(pkg.id, index)}
                        className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors"
                        aria-label="Feature entfernen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Speichern
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SettingsModal
