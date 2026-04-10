import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { ShoppingBag, Calendar, User, CreditCard, ChevronRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Order History</h2>
          <p>Track all sales and order statuses across carts.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">Export CSV</button>
        </div>
      </div>

      <div className="card list-card">
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Cart</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="font-bold">{order.billNumber}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-muted" />
                      <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>{order.cart?.name || 'N/A'}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer?.name}</span>
                      <span className="text-xs text-muted">{order.customer?.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-primary">₹{order.totalAmount}</span>
                  </td>
                  <td>
                    <span className={`badge-status ${order.paymentStatus === 'Completed' ? 'success' : 'warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon">
                      <ChevronRight size={18} />
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

export default Orders;
