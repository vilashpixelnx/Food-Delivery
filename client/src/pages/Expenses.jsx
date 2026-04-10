import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../services/expenseService';
import { getCarts } from '../services/cartService';
import { Wallet, PieChart, Plus, Trash2, Calendar, Tag, Store } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Material',
    amount: '',
    description: '',
    cart: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, cartsRes] = await Promise.all([getExpenses(), getCarts()]);
      setExpenses(expRes.data);
      setCarts(cartsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await createExpense(formData);
      setFormData({ category: 'Material', amount: '', description: '', cart: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Error adding expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await deleteExpense(id);
      fetchData();
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Expense Tracking</h2>
          <p>Manage daily operational costs and overheads.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <Plus size={18} /> {showForm ? 'Cancel' : 'Add Expense'}
           </button>
        </div>
      </div>

      <div className="dashboard-charts-row mb-2" style={{ marginBottom: '2rem' }}>
         <div className="card flex items-center gap-4 py-2" style={{ padding: '1.5rem 2rem' }}>
            <div className="icon-box primary">
               <Wallet size={24} />
            </div>
            <div>
               <span className="text-muted text-sm">Total Expenses</span>
               <h2 className="text-2xl font-bold">₹{totalExpense}</h2>
            </div>
         </div>
      </div>

      {showForm && (
        <div className="card mb-2" style={{ marginBottom: '2.5rem' }}>
          <h3>Record New Expense</h3>
          <form onSubmit={handleAddExpense} className="flex flex-col gap-4 mt-2" style={{ marginTop: '1.5rem' }}>
             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="text-xs font-bold uppercase text-muted">Category</label>
                 <select 
                    className="chart-filter w-full mt-1" 
                    style={{ width: '100%', height: '45px' }}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                   {['Gas', 'Water', 'Material', 'Salary', 'Rent', 'Electricity', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div className="flex-1">
                 <label className="text-xs font-bold uppercase text-muted">Amount (₹)</label>
                 <div className="input-box mt-1" style={{ height: '45px' }}>
                    <input type="number" placeholder="Enter amount" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                 </div>
               </div>
             </div>
             
             <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase text-muted">Associate Cart (Optional)</label>
                  <select 
                     className="chart-filter w-full mt-1" 
                     style={{ width: '100%', height: '45px' }}
                     value={formData.cart}
                     onChange={(e) => setFormData({...formData, cart: e.target.value})}
                   >
                     <option value="">General Expense</option>
                     {carts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase text-muted">Date</label>
                  <div className="input-box mt-1" style={{ height: '45px' }}>
                     <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>
             </div>

             <div>
                <label className="text-xs font-bold uppercase text-muted">Notes / Description</label>
                <div className="input-box mt-1" style={{ height: '45px' }}>
                   <input type="text" placeholder="e.g. Purchased 10kg potatoes" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
             </div>

             <button type="submit" className="btn btn-primary">Save Expense</button>
          </form>
        </div>
      )}

      <div className="card list-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Cart</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar size={14} className="text-muted" />
                    {new Date(exp.date).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Tag size={14} className="text-secondary" />
                    <span className="font-bold">{exp.category}</span>
                  </div>
                </td>
                <td className="text-sm">{exp.description || '-'}</td>
                <td>
                  <span className="text-xs">
                    {exp.cart ? <><Store size={12} /> {exp.cart.name}</> : 'General'}
                  </span>
                </td>
                <td>
                  <span className="font-bold text-accent">₹{exp.amount}</span>
                </td>
                <td>
                  <button className="btn-icon text-accent" onClick={() => handleDelete(exp._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
