import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingService';
import { Package, Plus, Trash2, Layers } from 'lucide-react';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUnit, setNewUnit] = useState('');
  const [allSettings, setAllSettings] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getSettings();
      setAllSettings(res.data);
      setUnits(res.data.units || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newUnit) return;
    if (units.includes(newUnit)) return alert('Unit already exists');
    
    const updated = [...units, newUnit];
    try {
      await updateSettings({ ...allSettings, units: updated });
      setUnits(updated);
      setNewUnit('');
    } catch (err) {
      alert('Error adding unit');
    }
  };

  const handleDelete = async (unitToDelete) => {
    if (window.confirm(`Delete unit "${unitToDelete}"?`)) {
      const updated = units.filter(u => u !== unitToDelete);
      try {
        await updateSettings({ ...allSettings, units: updated });
        setUnits(updated);
      } catch (err) {
        alert('Error deleting unit');
      }
    }
  };

  return (
    <div className="units-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Measurement Units</h2>
          <p>Define base units like Plate, Glass, KG, Bottle, etc.</p>
        </div>
      </div>

      <div className="flex gap-6 mt-4">
        {/* Add Section */}
        <div className="card" style={{ flex: '1', height: 'fit-content' }}>
          <h3>Add New Unit</h3>
          <p className="text-muted text-sm mb-2">Units define how you sell items.</p>
          <div className="flex flex-col gap-4 mt-2">
             <div className="input-box">
                <Layers size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Dozen" 
                  value={newUnit} 
                  onChange={(e) => setNewUnit(e.target.value)} 
                />
             </div>
             <button className="btn btn-primary w-full justify-center" onClick={handleAdd}>
                <Plus size={18} /> Create Unit
             </button>
          </div>
        </div>

        {/* List Section */}
        <div className="card" style={{ flex: '2' }}>
           <h3>Active Units</h3>
           <div className="mt-2 flex flex-col gap-2">
              {loading ? <div>Loading...</div> : (
                units.map((u, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-secondary/50 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="icon-badge accent icon-xs" style={{ background: 'rgba(231, 29, 54, 0.1)' }}><Package size={14} /></div>
                       <span className="font-bold text-lg">{u}</span>
                    </div>
                    <button className="btn-icon text-accent" onClick={() => handleDelete(u)}>
                       <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Units;
