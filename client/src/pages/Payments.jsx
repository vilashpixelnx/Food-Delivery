import React, { useState, useEffect } from 'react';
import { getPayments } from '../services/paymentService';
import { CreditCard, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getPayments();
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Captured': return <span className="badge-status success"><CheckCircle size={12} /> Captured</span>;
      case 'Failed': return <span className="badge-status danger"><XCircle size={12} /> Failed</span>;
      default: return <span className="badge-status warning"><Clock size={12} /> {status}</span>;
    }
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Payment Transactions</h2>
          <p>Detailed logs of all online and Razorpay transactions.</p>
        </div>
      </div>

      <div className="card list-card">
        {loading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>R-Order ID</th>
                <th>Payment ID</th>
                <th>Order Bill #</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="text-xs font-mono">{p.razorpayOrderId}</td>
                  <td className="text-xs font-mono">{p.razorpayPaymentId || '-'}</td>
                  <td>
                    <span className="font-bold">{p.order?.billNumber || 'N/A'}</span>
                  </td>
                  <td>
                    <span className="font-bold text-primary">₹{p.amount}</span>
                  </td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td className="text-xs">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <button className="btn-icon">
                       <ExternalLink size={16} />
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

export default Payments;
