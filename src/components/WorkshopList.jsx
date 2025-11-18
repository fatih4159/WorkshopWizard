import React, { useState, useEffect } from 'react';
import { Plus, FileText, Clock, Trash2, LogOut, User, Search } from 'lucide-react';
import { workshopAPI } from '../api/workshops';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';

export default function WorkshopList({ onSelectWorkshop }) {
  const { user, logout } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkshopTitle, setNewWorkshopTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const response = await workshopAPI.getAll();
      setWorkshops(response.workshops);
    } catch (error) {
      console.error('Error loading workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkshop = async () => {
    if (!newWorkshopTitle.trim()) return;

    try {
      setCreating(true);
      console.log('📝 Creating workshop with title:', newWorkshopTitle);

      const response = await workshopAPI.create(newWorkshopTitle);
      console.log('✅ Workshop created:', response);

      setShowCreateModal(false);
      setNewWorkshopTitle('');
      onSelectWorkshop(response.workshop);
    } catch (error) {
      console.error('❌ Error creating workshop:', error);
      console.error('Error details:', error.response?.data);
      alert('Fehler beim Erstellen des Workshops: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorkshop = async (id, e) => {
    e.stopPropagation();

    if (!confirm('Möchten Sie diesen Workshop wirklich löschen?')) {
      return;
    }

    try {
      await workshopAPI.delete(id);
      setWorkshops(workshops.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workshop:', error);
      alert('Fehler beim Löschen des Workshops');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredWorkshops = workshops.filter(w =>
    w.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Workshops werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">Workshop Wizard</h1>
              <p className="text-sm text-neutral-600 mt-1">
                Willkommen, {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Workshops durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="primary" onClick={() => {
            console.log('➕ Opening create modal');
            setShowCreateModal(true);
          }}>
            <Plus className="w-5 h-5 mr-2" />
            Neuer Workshop
          </Button>
        </div>

        {/* Workshops Grid */}
        {filteredWorkshops.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {searchTerm ? 'Keine Workshops gefunden' : 'Noch keine Workshops'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm
                ? 'Versuchen Sie einen anderen Suchbegriff'
                : 'Erstellen Sie Ihren ersten Workshop, um zu beginnen'}
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Neuer Workshop
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => onSelectWorkshop(workshop)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {workshop.title}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteWorkshop(workshop.id, e)}
                    className="text-neutral-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Schritt {workshop.current_step} von 8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Zuletzt: {formatDate(workshop.last_accessed)}</span>
                  </div>
                </div>

                {workshop.is_completed && (
                  <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    ✓ Abgeschlossen
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex justify-between items-center text-xs text-neutral-500">
                    <span>Erstellt: {new Date(workshop.created_at).toLocaleDateString('de-DE')}</span>
                    {workshop.data?.data?.customer?.name && (
                      <span className="truncate ml-2">{workshop.data.data.customer.name}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Workshop Modal */}
      {showCreateModal && (
        <Modal
          title="Neuer Workshop"
          onClose={() => {
            console.log('❌ Modal closing');
            setShowCreateModal(false);
            setNewWorkshopTitle('');
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Workshop-Titel
              </label>
              <Input
                type="text"
                value={newWorkshopTitle}
                onChange={(e) => {
                  console.log('✏️ Title changed:', e.target.value);
                  setNewWorkshopTitle(e.target.value);
                }}
                placeholder="z.B. Kundenname - Workshop 2024"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    console.log('⏎ Enter pressed');
                    handleCreateWorkshop();
                  }
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('🚫 Abbrechen clicked');
                  setShowCreateModal(false);
                  setNewWorkshopTitle('');
                }}
              >
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  console.log('🖱️ Erstellen button clicked');
                  console.log('Title:', newWorkshopTitle);
                  console.log('Disabled?', !newWorkshopTitle.trim() || creating);
                  handleCreateWorkshop();
                }}
                disabled={!newWorkshopTitle.trim() || creating}
              >
                {creating ? 'Erstellen...' : 'Erstellen'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
