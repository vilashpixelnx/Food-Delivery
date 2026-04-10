import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingService';
import { Tag, Plus, Trash2, ChevronRight, Loader2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [allSettings, setAllSettings] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      setAllSettings(res.data);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newCat.trim()) return;
    
    const trimmedCat = newCat.trim();
    if (categories.map(c => c.toLowerCase()).includes(trimmedCat.toLowerCase())) {
      return alert('This category already exists!');
    }
    
    setIsSubmitting(true);
    const updatedCategories = [...categories, trimmedCat];
    
    try {
      // Send the entire settings object with updated categories
      const res = await updateSettings({ 
        ...allSettings, 
        categories: updatedCategories 
      });
      
      setAllSettings(res.data);
      setCategories(res.data.categories);
      setNewCat('');
    } catch (err) {
      console.error('Update Error:', err);
      alert('Failed to add category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (catToDelete) => {
    if (window.confirm(`Are you sure you want to delete category "${catToDelete}"?`)) {
      const updatedCategories = categories.filter(c => c !== catToDelete);
      try {
        const res = await updateSettings({ 
          ...allSettings, 
          categories: updatedCategories 
        });
        setAllSettings(res.data);
        setCategories(res.data.categories);
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Master Categories</h2>
          <p>Group your items into custom categories for better sales tracking.</p>
        </div>
      </div>

      <div className="flex gap-6 mt-4">
        {/* Add Section */}
        <form onSubmit={handleAdd} className="card" style={{ flex: '1', height: 'fit-content' }}>
          <h3>Add New Category</h3>
          <div className="flex flex-col gap-4 mt-2">
             <div className="input-box">
                <Tag size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Special Chaat" 
                  value={newCat} 
                  required
                  onChange={(e) => setNewCat(e.target.value)} 
                  disabled={isSubmitting}
                />
             </div>
             <button 
                type="submit" 
                className="btn btn-primary w-full justify-center" 
                disabled={isSubmitting || !newCat.trim()}
             >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <><Plus size={18} /> Add Category</>
                )}
             </button>
          </div>
        </form>

        {/* List Section */}
        <div className="card" style={{ flex: '2' }}>
           <h3>Active Categories</h3>
           <div className="mt-2 flex flex-col gap-2">
              {loading ? (
                <div className="p-4 text-center">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="p-4 text-center text-muted">No categories defined yet.</div>
              ) : (
                categories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-3">
                       <div className="icon-badge secondary icon-xs"><ChevronRight size={14} /></div>
                       <span className="font-bold text-lg">{cat}</span>
                    </div>
                    <button className="btn-icon text-accent opacity-0 group-hover:opacity-100 transition-all" onClick={() => handleDelete(cat)}>
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

export default Categories;
