import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingService';
import { Settings as SettingsIcon, Save, Plus, X, Store } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    categories: [],
    units: [],
    storeName: '',
    defaultTaxPercent: 0
  });
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [newUnit, setNewUnit] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const addCategory = () => {
    if (newCat && !settings.categories.includes(newCat)) {
      setSettings({ ...settings, categories: [...settings.categories, newCat] });
      setNewCat('');
    }
  };

  const removeCategory = (cat) => {
    setSettings({ ...settings, categories: settings.categories.filter(c => c !== cat) });
  };

  const addUnit = () => {
    if (newUnit && !settings.units.includes(newUnit)) {
      setSettings({ ...settings, units: [...settings.units, newUnit] });
      setNewUnit('');
    }
  };

  const removeUnit = (unit) => {
    setSettings({ ...settings, units: settings.units.filter(u => u !== unit) });
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>System Configuration</h2>
          <p>Customize your master lists (Categories, Units) and store information.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary" onClick={handleSave}>
              <Save size={18} /> Save All Settings
           </button>
        </div>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Category Management */}
        <div className="card">
           <h3 className="mb-2">Manage Categories</h3>
           <p className="text-muted text-sm mb-2">Define the types of food or items you sell.</p>
           <div className="flex gap-2 mb-2" style={{ marginBottom: '1.5rem' }}>
              <div className="input-box flex-1" style={{ height: '40px' }}>
                 <input type="text" placeholder="e.g. Desserts" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
              </div>
              <button className="btn btn-outline" onClick={addCategory}><Plus size={18} /></button>
           </div>
           <div className="tags-container flex gap-2 flex-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {settings.categories.map(cat => (
                <div key={cat} className="badge-status info flex items-center gap-1" style={{ padding: '0.5rem 0.8rem', background: 'var(--glass)', color: 'white' }}>
                   {cat} <X size={14} className="cursor-pointer" onClick={() => removeCategory(cat)} />
                </div>
              ))}
           </div>
        </div>

        {/* Units Management */}
        <div className="card">
           <h3 className="mb-2">Manage Base Units</h3>
           <p className="text-muted text-sm mb-2">Define how you measure your items (Plate, KG, etc).</p>
           <div className="flex gap-2 mb-2" style={{ marginBottom: '1.5rem' }}>
              <div className="input-box flex-1" style={{ height: '40px' }}>
                 <input type="text" placeholder="e.g. Packet" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} />
              </div>
              <button className="btn btn-outline" onClick={addUnit}><Plus size={18} /></button>
           </div>
           <div className="tags-container flex gap-2 flex-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {settings.units.map(u => (
                <div key={u} className="badge-status success flex items-center gap-1" style={{ padding: '0.5rem 0.8rem', background: 'var(--glass)', color: 'white' }}>
                   {u} <X size={14} className="cursor-pointer" onClick={() => removeUnit(u)} />
                </div>
              ))}
           </div>
        </div>

        {/* Store Profile */}
        <div className="card">
           <h3 className="mb-2">Store Profile</h3>
           <div className="flex flex-col gap-4 mt-2">
              <div>
                 <label className="text-xs font-bold uppercase text-muted">Store Name</label>
                 <div className="input-box mt-1"><input type="text" value={settings.storeName} onChange={(e) => setSettings({...settings, storeName: e.target.value})} /></div>
              </div>
              <div>
                 <label className="text-xs font-bold uppercase text-muted">Default Tax Rate (%)</label>
                 <div className="input-box mt-1"><input type="number" value={settings.defaultTaxPercent} onChange={(e) => setSettings({...settings, defaultTaxPercent: e.target.value})} /></div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
