import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';

// Placeholder Pages for future phases
const Placeholder = ({ title }) => (
  <div className="card">
    <h2>{title}</h2>
    <p>This module will be implemented in the upcoming phase.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Application Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="billing" element={<Placeholder title="POS / Billing System" />} />
          <Route path="orders" element={<Placeholder title="Order Management" />} />
          <Route path="stock" element={<Placeholder title="Stock & Inventory" />} />
          <Route path="customers" element={<Placeholder title="Customer Database" />} />
          <Route path="carts" element={<Placeholder title="Cart Management" />} />
          <Route path="expenses" element={<Placeholder title="Expense Tracking" />} />
          <Route path="reports" element={<Placeholder title="Analytics & Reports" />} />
        </Route>

        {/* Auth routes (Phase 10) */}
        <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
