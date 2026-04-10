import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Carts from './pages/Carts';
import Stock from './pages/Stock';
import Billing from './pages/Billing';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Placeholder Pages for remaining modules
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
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Application Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="carts" element={<Carts />} />
          <Route path="stock" element={<Stock />} />
          <Route path="billing" element={<Billing />} />
          
          <Route path="expenses" element={<Placeholder title="Expense Tracking" />} />
          
          {/* Admin Only Routes */}
          <Route 
            path="reports" 
            element={
              <ProtectedRoute roles={['admin']}>
                <Placeholder title="Analytics & Reports" />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
