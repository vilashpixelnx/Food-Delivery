import React, { useState, useEffect } from 'react';
import { getAllStock, updateStock } from '../services/stockService';
import { getCarts } from '../services/cartService';
import { Package, AlertTriangle, RefreshCw, Filter, Plus, Minus, Search } from 'lucide-react';

const Stock = () => {
  const [stock, setStock] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stockRes, cartsRes] = await Promise.all([
        getAllStock(),
        getCarts()
      ]);
      setStock(stockRes.data);
      setCarts(cartsRes.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = selectedCart === 'all' 
    ? stock 
    : stock.filter(item => item.cart?._id === selectedCart);

  return (
    <div className="stock-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Stock & Inventory</h2>
          <p>Monitor product levels across all carts and manage replenishment.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary" onClick={fetchData}>
              <RefreshCw size={18} /> Sync Stock
           </button>
        </div>
      </div>

      <div className="stock-filters card flex items-center justify-between mb-2" style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <Filter size={18} className="text-muted" />
               <span className="text-sm font-bold">Filter by Cart:</span>
            </div>
            <select 
               className="chart-filter" 
               value={selectedCart}
               onChange={(e) => setSelectedCart(e.target.value)}
            >
               <option value="all">All Carts</option>
               {carts.map(cart => (
                  <option key={cart._id} value={cart._id}>{cart.name}</option>
               ))}
            </select>
         </div>
         
         <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
               <span className="badge-status success" style={{ width: '12px', height: '12px', padding: 0, borderRadius: '50%' }}></span>
               <span>In Stock</span>
            </div>
            <div className="flex items-center gap-1">
               <span className="badge-status warning" style={{ width: '12px', height: '12px', padding: 0, borderRadius: '50%' }}></span>
               <span>Low Stock</span>
            </div>
         </div>
      </div>

      <div className="card list-card">
        {loading ? (
          <div className="loading-state">Loading inventory data...</div>
        ) : filteredStock.length === 0 ? (
          <div className="empty-state">No stock entries found for this selection.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Cart</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item) => {
                const isLow = item.currentQuantity <= item.lowStockThreshold;
                return (
                  <tr key={item._id}>
                    <td>
                      <div className="flex items-center gap-2">
                         <div className={`icon-badge ${isLow ? 'accent' : 'secondary'} icon-xs`}>
                             <Package size={14} />
                         </div>
                         <span className="font-bold">{item.product?.name}</span>
                         {isLow && <AlertTriangle size={14} className="text-accent" />}
                      </div>
                    </td>
                    <td>{item.cart?.name}</td>
                    <td>
                       <span className="text-xs text-muted">{item.product?.category}</span>
                    </td>
                    <td>
                      <span className={`font-bold ${isLow ? 'text-accent' : 'text-main'}`} style={{ fontSize: '1.1rem' }}>
                        {item.currentQuantity} {item.product?.unit || 'units'}
                      </span>
                    </td>
                    <td>{item.lowStockThreshold}</td>
                    <td>
                      <span className="text-xs text-muted">
                        {new Date(item.updatedAt).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                         <button className="btn btn-outline btn-xs" title="Add Stock" style={{ padding: '0.4rem' }}>
                            <Plus size={14} />
                         </button>
                         <button className="btn btn-outline btn-xs" title="Remove Stock" style={{ padding: '0.4rem' }}>
                            <Minus size={14} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Stock;
