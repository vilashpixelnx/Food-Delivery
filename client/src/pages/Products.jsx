import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getSettings } from '../services/settingService';
import { Package, Plus, Edit2, Trash2, Tag, Percent, Receipt } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ categories: [], units: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    taxPercent: 0,
    discountPercent: 0,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, setRes] = await Promise.all([getProducts(), getSettings()]);
      setProducts(prodRes.data);
      setSettings(setRes.data);
      
      // Set defaults if not editing
      if (!editingId) {
        setFormData(prev => ({
          ...prev,
          category: setRes.data.categories[0] || 'Other',
          unit: setRes.data.units[0] || 'Plate',
          taxPercent: setRes.data.defaultTaxPercent || 0
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      taxPercent: product.taxPercent || 0,
      discountPercent: product.discountPercent || 0,
      description: product.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      category: settings.categories[0] || 'Other', 
      price: '', 
      unit: settings.units[0] || 'Plate', 
      taxPercent: settings.defaultTaxPercent || 0, 
      discountPercent: 0, 
      description: '' 
    });
    setEditingId(null);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Product Catalog</h2>
          <p>Create and manage items available for sale across your carts.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={18} /> Add New Item
           </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
           <div className="card modal-content" style={{ maxWidth: '600px', width: '90%' }}>
              <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                 <div>
                    <label className="text-xs font-bold uppercase text-muted">Product Name</label>
                    <div className="input-box mt-1"><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-xs font-bold uppercase text-muted">Category</label>
                       <select className="chart-filter w-full mt-1" style={{ width: '100%', height: '45px' }} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                          {settings.categories.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold uppercase text-muted">Price (Base ₹)</label>
                       <div className="input-box mt-1" style={{ height: '45px' }}><input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-xs font-bold uppercase text-muted">Base Unit</label>
                       <select className="chart-filter w-full mt-1" style={{ width: '100%', height: '45px' }} value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                          {settings.units.map(u => <option key={u} value={u}>{u}</option>)}
                       </select>
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold uppercase text-muted">Tax (%)</label>
                       <div className="input-box mt-1" style={{ height: '45px' }}>
                          <Receipt size={16} />
                          <input type="number" value={formData.taxPercent} onChange={(e) => setFormData({...formData, taxPercent: e.target.value})} />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold uppercase text-muted">Fixed Discount (%)</label>
                    <div className="input-box mt-1" style={{ height: '45px' }}>
                       <Percent size={16} />
                       <input type="number" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: e.target.value})} />
                    </div>
                 </div>

                 <div className="flex gap-2 justify-end mt-2">
                    <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Product</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <div className="card list-card">
        {loading ? (
          <div>Loading items...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Tax / Disc</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="flex items-center gap-2">
                       <div className="icon-badge secondary icon-xs"><Package size={14} /></div>
                       <span className="font-bold">{product.name}</span>
                    </div>
                  </td>
                  <td>
                     <span className="badge-status info" style={{ color: '#3A86FF', background: 'rgba(58, 134, 255, 0.1)' }}>
                        {product.category}
                     </span>
                  </td>
                  <td><span className="font-bold text-primary">₹{product.price}</span></td>
                  <td>
                     <div className="flex flex-col text-xs">
                        <span className="text-accent">Tax: {product.taxPercent || 0}%</span>
                        <span className="text-secondary">Disc: {product.discountPercent || 0}%</span>
                     </div>
                  </td>
                  <td>{product.unit}</td>
                  <td>
                    <div className="flex gap-2">
                       <button className="btn-icon text-secondary" onClick={() => handleEdit(product)}><Edit2 size={16} /></button>
                       <button className="btn-icon text-accent" onClick={() => handleDelete(product._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
