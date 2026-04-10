import React, { useState, useEffect } from 'react';
import { getCarts } from '../services/cartService';
import { Store, MapPin, Activity, Edit2, MoreVertical } from 'lucide-react';

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await getCarts();
      setCarts(response.data);
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="carts-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Quick Carts</h2>
          <p>Manage and monitor all active Pani Puri carts distribution.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary">+ Register New Cart</button>
        </div>
      </div>

      <div className="carts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div>Loading carts...</div>
        ) : carts.length === 0 ? (
          <div>No carts registered yet.</div>
        ) : (
          carts.map((cart) => (
            <div key={cart._id} className="card cart-card flex-col">
               <div className="flex justify-between items-center mb-1" style={{ marginBottom: '1.5rem' }}>
                  <div className="flex items-center gap-2">
                     <div className="icon-box secondary">
                        <Store size={22} />
                     </div>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cart.name}</h3>
                  </div>
                  <button className="btn-icon"><MoreVertical size={18} /></button>
               </div>

               <div className="flex flex-col gap-2 mb-1" style={{ marginBottom: '1.5rem' }}>
                  <div className="flex items-center gap-1 text-muted text-sm">
                     <MapPin size={14} /> <span>{cart.location || 'Location Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                     <Activity size={14} className={cart.isActive ? 'text-primary' : 'text-muted'} /> 
                     <span>Status: </span>
                     <span className={cart.isActive ? 'text-primary font-bold' : 'text-muted'}>
                        {cart.isActive ? 'Active & Selling' : 'Offline'}
                     </span>
                  </div>
               </div>

               <div className="flex gap-2">
                  <button className="btn btn-outline" style={{ flex: 1 }}>
                     <Edit2 size={16} /> Edit
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                     View Stock
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Carts;
