import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCarts } from '../services/cartService';
import { searchCustomerByPhone, createCustomer } from '../services/customerService';
import { createOrder } from '../services/orderService';
import { generateBillPDF } from '../services/billService';
import { 
  Search, 
  ShoppingCart, 
  UserPlus, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle,
  FileText,
  CreditCard,
  Banknote
} from 'lucide-react';
import './Billing.css';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState('');
  
  // Cart Items
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  // Customer State
  const [customerPhone, setCustomerPhone] = useState('');
  const [customer, setCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([getProducts(), getCarts()]);
      setProducts(pRes.data);
      setCarts(cRes.data);
      if (cRes.data.length > 0) setSelectedCart(cRes.data[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const findCustomer = async () => {
    if (!customerPhone) return;
    try {
      const res = await searchCustomerByPhone(customerPhone);
      setCustomer(res.data);
      setCustomerName(res.data.name);
    } catch (err) {
      setCustomer(null);
      setCustomerName('');
      // Error means not found, we'll allow creating one on checkout
    }
  };

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.product === product._id);
    if (exists) {
      setCartItems(cartItems.map(item => 
        item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.product === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.product !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  const handleCheckout = async (paymentMethod) => {
    if (!selectedCart) return alert('Select a cart');
    if (cartItems.length === 0) return alert('Cart is empty');
    if (!customerPhone) return alert('Customer phone required');

    setLoading(true);
    try {
      let finalCustomerId = customer?._id;

      // Create customer if not exists
      if (!customer) {
        const newCustRes = await createCustomer({ 
          name: customerName || 'Walk-in Customer', 
          phone: customerPhone 
        });
        finalCustomerId = newCustRes.data._id;
      }

      const orderData = {
        cart: selectedCart,
        customer: finalCustomerId,
        items: cartItems,
        discount,
        paymentMethod,
        paymentStatus: 'Completed'
      };

      const res = await createOrder(orderData);
      setCheckoutSuccess(res.data);
      setCartItems([]);
      setCustomer(null);
      setCustomerPhone('');
      setCustomerName('');
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="checkout-success-container card">
        <div className="success-icon">
          <CheckCircle size={80} color="var(--secondary)" />
        </div>
        <h2>Order Placed Successfully!</h2>
        <p>Bill Number: <strong>{checkoutSuccess.billNumber}</strong></p>
        <div className="flex gap-4 mt-2" style={{ marginTop: '2rem' }}>
          <button className="btn btn-primary" onClick={() => generateBillPDF(checkoutSuccess._id)}>
            <FileText size={20} /> Download PDF Bill
          </button>
          <button className="btn btn-outline" onClick={() => setCheckoutSuccess(null)}>
            New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="billing-grid">
        
        {/* Left: Product Selection */}
        <div className="products-section">
          <div className="section-header flex justify-between items-center mb-2">
             <h3>Select Items</h3>
             <div className="cart-selector">
                <select value={selectedCart} onChange={(e) => setSelectedCart(e.target.value)}>
                   {carts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
             </div>
          </div>
          
          <div className="products-list-grid">
            {products.map(product => (
              <div key={product._id} className="product-card card" onClick={() => addToCart(product)}>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <span className="price">₹{product.price}</span>
                  <span className="category">{product.category}</span>
                </div>
                <div className="add-btn">
                   <Plus size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart & Checkout */}
        <div className="cart-section card">
          <div className="cart-header border-b mb-2 pb-2">
            <h3 className="flex items-center gap-2">
              <ShoppingCart size={22} className="text-primary" /> Active Cart
            </h3>
          </div>

          <div className="customer-search mb-2">
            <label className="text-xs font-bold text-muted uppercase">Customer Details</label>
            <div className="flex gap-2 mt-1">
              <div className="input-box flex-1" style={{ height: '40px' }}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  onBlur={findCustomer}
                />
              </div>
            </div>
            {(!customer && customerPhone.length >= 10) && (
              <div className="input-box mt-2" style={{ height: '40px', marginTop: '10px' }}>
                <UserPlus size={16} />
                <input 
                  type="text" 
                  placeholder="Customer Name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            )}
            {customer && (
              <div className="customer-info-box mt-1">
                <span className="text-sm font-bold text-secondary">Found: {customer.name}</span>
              </div>
            )}
          </div>

          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <div className="empty-cart text-center p-4">
                <p className="text-muted">Cart is empty. Add some Pani Puri!</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.product} className="cart-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.product, -1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, 1)}><Plus size={14} /></button>
                    <button className="text-accent ml-2" onClick={() => removeItem(item.product)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary border-t mt-4 pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-1 items-center">
              <span>Discount</span>
              <input 
                type="number" 
                className="no-spin text-right" 
                style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }} 
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
              <span>Grand Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>

          <div className="checkout-btns mt-4">
             <button 
              className="btn btn-primary w-full justify-center mb-2" 
              style={{ width: '100%', marginBottom: '10px' }}
              disabled={loading || cartItems.length === 0}
              onClick={() => handleCheckout('Cash')}
            >
               <Banknote size={20} /> Pay with Cash
             </button>
             <button 
              className="btn btn-outline w-full justify-center" 
              style={{ width: '100%', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
              disabled={loading || cartItems.length === 0}
              onClick={() => handleCheckout('UPI')}
            >
               <CreditCard size={20} /> Pay via UPI / QR
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Billing;
