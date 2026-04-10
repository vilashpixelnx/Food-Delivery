import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  ReceiptIndianRupee, 
  TrendingUp, 
  LogOut,
  Store,
  Wallet,
  CreditCard,
  Settings as SettingsIcon,
  Tag,
  Layers
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'POS / Billing', icon: <ReceiptIndianRupee size={20} />, path: '/billing' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders' },
    { name: 'Stock', icon: <Package size={20} />, path: '/stock' },
    { name: 'Carts', icon: <Store size={20} />, path: '/carts' },
    { name: 'Products', icon: <Package size={20} />, path: '/products' },
    { name: 'Categories', icon: <Tag size={20} />, path: '/categories' },
    { name: 'Units', icon: <Layers size={20} />, path: '/units' },
    { name: 'Customers', icon: <Users size={20} />, path: '/customers' },
    { name: 'Expenses', icon: <Wallet size={20} />, path: '/expenses' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/payments' },
    { name: 'Reports', icon: <TrendingUp size={20} />, path: '/reports' },
    { name: 'Settings', icon: <SettingsIcon size={20} />, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Store className="logo-icon" size={32} />
        <div className="logo-text">
          <h1>Smart Cart</h1>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
