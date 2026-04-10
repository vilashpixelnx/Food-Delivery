import React from 'react';
import './ThermalReceipt.css';

const ThermalReceipt = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div className="receipt-container" ref={ref}>
      <div className="receipt-header">
        <h1>SMART PANI PURI</h1>
        <p>Fresh & Hygienic</p>
        <p>{order.cart?.name || 'Main Cart'}</p>
        <div className="divider">***************************</div>
      </div>

      <div className="receipt-info">
        <p>Bill: {order.billNumber}</p>
        <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
        <p>Cust: {order.customer?.name} ({order.customer?.phone})</p>
      </div>

      <div className="divider">---------------------------</div>

      <table className="receipt-table">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="text-left">{item.name}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divider">---------------------------</div>

      <div className="receipt-summary">
        <div className="flex-row">
          <span>Subtotal:</span>
          <span>₹{order.totalAmount + (order.discount || 0)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex-row">
            <span>Discount:</span>
            <span>-₹{order.discount}</span>
          </div>
        )}
        <div className="flex-row total">
          <span>TOTAL:</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="divider">***************************</div>

      <div className="receipt-footer">
        <p>Thank You! Visit Again</p>
        <p>Scan to Pay Next Time</p>
        <div className="qr-placeholder">[QR CODE]</div>
      </div>
    </div>
  );
});

export default ThermalReceipt;
