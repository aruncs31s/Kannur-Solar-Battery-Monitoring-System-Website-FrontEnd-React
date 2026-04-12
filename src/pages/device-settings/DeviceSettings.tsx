import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Key, Trash2, Globe, Lock, Shield, Settings, Server, ChevronRight } from 'lucide-react';
import { useDeviceSettings } from './hooks/useDeviceSettings';
import { useAuthStore } from '../../store/authStore';
import { TransferOwnershipModal } from '../../components/TransferOwnershipModal';
import { useState } from 'react';
import { DeviceTokenModal } from '../../components/DeviceTokenModal';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'general' | 'access' | 'developer' | 'danger';

export const DeviceSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const {
    device,
    deviceTypes,
    ownership,
    loading,
    error,
    updateForm,
    setUpdateForm,
    updateMessage,
    isUpdating,
    generatedToken,
    showTransferModal,
    setShowTransferModal,
    showDeleteModal,
    setShowDeleteModal,
    handleUpdateDevice,
    handleTransferOwnership,
    handleToggleVisibility,
    handleDeleteDevice,
    generateToken
  } = useDeviceSettings(id);

  const { user: currentUser } = useAuthStore();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);

  const canEditOwnership = currentUser?.role === 'admin' || (device && ownership && parseInt(currentUser?.id || '0') === ownership.owner_id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-text-secondary animate-pulse">Loading device settings...</div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-error/10 border border-error/20 text-error p-6 rounded-xl flex items-center gap-4">
          <div className="bg-error/20 p-2 rounded-lg">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="font-bold">Error Loading Settings</h3>
            <p className="text-sm opacity-90">{error || 'Device not found or access denied'}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateToken = async () => {
    await generateToken();
    setShowTokenModal(true);
  };

  const navItems = [
    { id: 'general', label: 'General', icon: Server, color: 'text-primary-500' },
    { id: 'access', label: 'Access & Privacy', icon: Shield, color: 'text-nord-14' },
    { id: 'developer', label: 'Developer (API)', icon: Key, color: 'text-nord-15' },
    { id: 'danger', label: 'Danger Zone', icon: Trash2, color: 'text-error' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-fit flex items-center gap-1.5 text-text-accent hover:text-nord-10 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft size={14} /> Back to {device.name}
          </button>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-surface-secondary rounded-xl border border-border-primary">
                <Settings className="text-primary-500" size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Settings</h1>
                <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Device ID: {device.id}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary-500/10 text-primary-500 font-bold border-l-4 border-primary-500' 
                      : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? item.color : 'text-text-tertiary group-hover:text-text-secondary'} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-surface-primary rounded-2xl border border-border-primary shadow-sm overflow-hidden"
            >
              {/* General Tab */}
              {activeTab === 'general' && (
                <div>
                  <div className="px-8 py-6 border-b border-border-primary bg-surface-secondary/50">
                    <h2 className="text-xl font-bold text-text-primary">General Configuration</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage core metadata and physical identity of this device.</p>
                  </div>
                  <div className="p-8">
                    {updateMessage && (
                      <div className={`mb-8 p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${updateMessage.includes('successfully') ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
                        <div className={`w-2 h-2 rounded-full ${updateMessage.includes('successfully') ? 'bg-success' : 'bg-error'} animate-pulse`} />
                        {updateMessage}
                      </div>
                    )}
                    
                    <form onSubmit={handleUpdateDevice} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-primary ml-1">Device Display Name</label>
                          <input
                            type="text"
                            required
                            value={updateForm.name}
                            onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-text-muted hover:bg-surface-tertiary/50"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-primary ml-1">Hardware Category</label>
                          <select
                            required
                            value={updateForm.type}
                            onChange={(e) => setUpdateForm({ ...updateForm, type: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none hover:bg-surface-tertiary/50"
                          >
                            <option value={0} disabled>Select Hardware Type</option>
                            {deviceTypes.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-primary ml-1">IP Address</label>
                          <input
                            type="text"
                            value={updateForm.ip_address}
                            onChange={(e) => setUpdateForm({ ...updateForm, ip_address: e.target.value })}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-text-muted font-mono hover:bg-surface-tertiary/50"
                            placeholder="e.g. 192.168.1.100"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-primary ml-1">MAC Address</label>
                          <input
                            type="text"
                            value={updateForm.mac_address}
                            onChange={(e) => setUpdateForm({ ...updateForm, mac_address: e.target.value })}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-text-muted font-mono uppercase hover:bg-surface-tertiary/50"
                            placeholder="e.g. 00:1B:44:11:3A:B7"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-primary ml-1">Physical Address</label>
                          <input
                            type="text"
                            value={updateForm.address}
                            onChange={(e) => setUpdateForm({ ...updateForm, address: e.target.value })}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all hover:bg-surface-tertiary/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-primary ml-1">City/Location</label>
                          <input
                            type="text"
                            value={updateForm.city}
                            onChange={(e) => setUpdateForm({ ...updateForm, city: e.target.value })}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all hover:bg-surface-tertiary/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-border-primary">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 active:scale-95"
                        >
                          <Save size={18} />
                          {isUpdating ? 'Saving Changes...' : 'Save Settings'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Access Tab */}
              {activeTab === 'access' && (
                <div>
                  <div className="px-8 py-6 border-b border-border-primary bg-surface-secondary/50">
                    <h2 className="text-xl font-bold text-text-primary">Access & Privacy</h2>
                    <p className="text-sm text-text-secondary mt-1">Control who can view and manage this device.</p>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    {ownership ? (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-surface-secondary/50 border border-border-primary">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                               <Shield size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Device Owner</p>
                                <p className="text-xl font-extrabold text-text-primary">{ownership.owner_name}</p>
                            </div>
                          </div>
                          
                          {canEditOwnership && (
                            <button
                              onClick={() => setShowTransferModal(true)}
                              className="px-6 py-2.5 bg-surface-primary hover:bg-surface-tertiary border border-border-primary text-text-primary rounded-xl font-bold transition-all text-sm shadow-sm active:scale-95"
                            >
                              Transfer Ownership
                            </button>
                          )}
                        </div>

                        {canEditOwnership && (
                           <div className="flex items-center justify-between p-6 rounded-2xl border border-border-primary bg-surface-primary shadow-sm">
                            <div className="flex items-start gap-4">
                              <div className={`p-4 rounded-2xl flex-shrink-0 ${ownership.is_public ? 'bg-success/10 text-success' : 'bg-nord-14/10 text-nord-14'}`}>
                                {ownership.is_public ? <Globe size={28} /> : <Lock size={28} />}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-text-primary">
                                  {ownership.is_public ? 'Public Visibility' : 'Private Mode'}
                                </h3>
                                <p className="text-sm text-text-secondary mt-1 max-w-sm">
                                  {ownership.is_public 
                                    ? 'Public devices are visible to all authenticated users on the global dashboard.'
                                    : 'Private devices are restricted to the owner and system administrators.'}
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={ownership.is_public}
                                onChange={(e) => handleToggleVisibility(e.target.checked)}
                              />
                              <div className="w-14 h-7 bg-surface-tertiary rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success shadow-inner"></div>
                            </label>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-8 text-center bg-surface-secondary/30 rounded-2xl border border-dashed border-border-primary">
                        <Lock className="mx-auto text-text-tertiary mb-3 opacity-20" size={48} />
                        <p className="text-text-secondary italic">Ownership details are currently unavailable for this device.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Developer Tab */}
              {activeTab === 'developer' && (
                <div>
                   <div className="px-8 py-6 border-b border-border-primary bg-surface-secondary/50">
                    <h2 className="text-xl font-bold text-text-primary">Developer API</h2>
                    <p className="text-sm text-text-secondary mt-1">Configure secure authentication for hardware-to-cloud communication.</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="bg-surface-secondary/50 rounded-2xl border border-border-primary p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Key size={20} className="text-nord-15" />
                          <h3 className="text-lg font-extrabold text-text-primary">Device Authentication Token</h3>
                        </div>
                        <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
                          Hardware devices must include this token in their HTTP headers to authenticate with our servers. 
                          <span className="text-error font-bold block mt-2">Warning: Generating a new token will immediately disconnect any active hardware using the old one.</span>
                        </p>
                      </div>
                      
                      <button
                        onClick={handleGenerateToken}
                        className="flex items-center gap-2 px-8 py-3 bg-nord-15 hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-lg shadow-nord-15/20 active:scale-95 flex-shrink-0"
                      >
                        <Lock size={18} />
                        Rotate Token
                      </button>
                    </div>
                    
                    <div className="mt-8 p-6 bg-surface-secondary/30 rounded-2xl border border-border-primary">
                      <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-4">Implementation Guide</h4>
                      <div className="bg-nord-0 p-4 rounded-xl font-mono text-xs text-nord-4 overflow-x-auto whitespace-pre">
                        {`Authorization: Bearer <your_token>`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Tab */}
              {activeTab === 'danger' && (
                <div>
                  <div className="px-8 py-6 border-b border-error/20 bg-error/5">
                    <h2 className="text-xl font-bold text-error">Danger Zone</h2>
                    <p className="text-sm text-red-500/80 mt-1">Irreversible and destructive actions for this device record.</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="rounded-2xl border border-error/20 bg-error/5 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold text-text-primary">Decommission & Delete Device</h3>
                        <p className="text-sm text-text-secondary max-w-lg">
                          Permanently remove <strong>{device.name}</strong> from the system. 
                          All historical telemetry, sensor data, and configuration logs will be deleted forever.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-8 py-3 bg-error text-white hover:bg-red-700 rounded-xl font-extrabold transition-all shadow-lg shadow-error/20 active:scale-95 flex-shrink-0"
                      >
                        Delete Device
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      {showTransferModal && ownership && (
        <TransferOwnershipModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          deviceName={device.name}
          onTransfer={handleTransferOwnership}
        />
      )}

      <DeviceTokenModal
        isOpen={showTokenModal}
        token={generatedToken}
        onClose={() => setShowTokenModal(false)}
      />

      {/* Delete Device Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-primary rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border-primary"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-error/10 mb-6 mx-auto">
                <Trash2 className="text-error" size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-text-primary text-center mb-2 tracking-tight">Destructive Action</h3>
              
              <p className="text-text-secondary text-center mb-8 text-sm leading-relaxed">
                This will permanently eliminate <strong>{device.name}</strong>. 
                Any hardware relying on these credentials will cease to report data.
              </p>
              
              <div className="mb-8 p-4 bg-surface-secondary rounded-2xl border border-border-primary">
                <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 text-center">
                  Verification Required
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-tertiary border border-border-primary rounded-xl text-text-primary text-center font-bold focus:outline-none focus:border-error focus:ring-4 focus:ring-error/10 transition-all placeholder:font-normal placeholder:text-text-muted hover:bg-surface-tertiary/80"
                  placeholder={device.name}
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteDevice}
                  disabled={deleteConfirmation !== device.name}
                  className="w-full py-4 bg-error hover:bg-red-700 disabled:opacity-30 disabled:grayscale text-white rounded-2xl font-black transition-all shadow-xl shadow-error/20 active:scale-95"
                >
                  Confirm Permanent Deletion
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  className="w-full py-3 bg-transparent hover:bg-surface-secondary text-text-secondary rounded-2xl font-bold transition-all"
                >
                  Cancel and Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
