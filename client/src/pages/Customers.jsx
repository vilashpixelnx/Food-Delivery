import React, { useState, useEffect } from 'react';
import { getCustomers } from '../services/customerService';
import { Mail, Phone, ShoppingBag, ArrowUpRight } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customers-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Customer Database</h2>
          <p>View customer loyalty, order history, and contact details.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary">+ Add New Customer</button>
        </div>
      </div>

      <div className="card list-card">
        {loading ? (
          <div className="loading-state">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="empty-state">No customers registered yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact info</th>
                <th>Total Orders</th>
                <th>Lifetime Value</th>
                <th>Last Order</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id}>
                  <td>
                    <div className="flex items-center gap-2">
                       <div className="icon-badge primary icon-xs">
                          {cust.name.charAt(0)}
                       </div>
                       <span className="font-bold">{cust.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-xs">
                         <Phone size={10} /> {cust.phone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted">
                         <Mail size={10} /> {cust.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                       <ShoppingBag size={14} className="text-secondary" />
                       {cust.totalOrders}
                    </div>
                  </td>
                  <td>
                    <span className="font-bold">₹{cust.totalSpent}</span>
                  </td>
                  <td>
                    <span className="text-xs text-muted">
                      {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-xs">
                       Details <ArrowUpRight size={14} />
                    </button>
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

export default Customers;
