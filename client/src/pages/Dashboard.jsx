import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  // Mock Stats - In future these will come from API
  const stats = [
    { label: 'Total Sales', value: '₹1,24,500', icon: <DollarSign size={24} />, color: 'primary', trend: '+12.5%', isUp: true },
    { label: 'Total Orders', value: '854', icon: <ShoppingBag size={24} />, color: 'secondary', trend: '+8.2%', isUp: true },
    { label: 'Customers', value: '412', icon: <Users size={24} />, color: 'info', trend: '-2.4%', isUp: false },
    { label: 'Net Profit', value: '₹48,200', icon: <TrendingUp size={24} />, color: 'success', trend: '+18.7%', isUp: true },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">+ New Order</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card">
            <div className={`icon-box ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <h3 className="stat-value">{stat.value}</h3>
              <div className={`stat-trend ${stat.isUp ? 'up' : 'down'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.trend}</span>
                <span className="trend-text">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts-row">
        <div className="chart-container card">
          <div className="chart-header">
            <h3>Revenue Analytics</h3>
            <select className="chart-filter">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="chart-placeholder">
            {/* Chart.js will go here in future step */}
            <div className="mock-chart-bars">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="bar" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="list-container card">
          <div className="chart-header">
            <h3>Recent Orders</h3>
            <button className="btn-text">View All</button>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Cart</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td>#0241{i}</td>
                  <td>Main Cart</td>
                  <td>₹250</td>
                  <td><span className="badge-status success">Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
