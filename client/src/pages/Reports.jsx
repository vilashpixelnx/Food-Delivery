import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getAnalytics, getCartPerformance, getDashboardStats } from '../services/reportService';
import { TrendingUp, DollarSign, Wallet, ShoppingBag, ArrowUpRight } from 'lucide-react';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [analytics, setAnalytics] = useState({ sales: [], expenses: [] });
  const [cartPerf, setCartPerf] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [anaRes, cartRes, statRes] = await Promise.all([
        getAnalytics(),
        getCartPerformance(),
        getDashboardStats()
      ]);
      setAnalytics(anaRes.data);
      setCartPerf(cartRes.data);
      setStats(statRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Line Chart Data: Sales vs Expenses
  const lineChartData = {
    labels: analytics.sales.map(s => s._id),
    datasets: [
      {
        label: 'Sales Revenue',
        data: analytics.sales.map(s => s.amount),
        borderColor: '#FF9F1C',
        backgroundColor: 'rgba(255, 159, 28, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: analytics.expenses.map(e => e.amount),
        borderColor: '#E71D36',
        backgroundColor: 'rgba(231, 29, 54, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Bar Chart Data: Cart Performance
  const barChartData = {
    labels: cartPerf.map(c => c.cartName),
    datasets: [
      {
        label: 'Total Revenue per Cart',
        data: cartPerf.map(c => c.totalSales),
        backgroundColor: '#2EC4B6',
        borderRadius: 8,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#8492A6' } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8492A6' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8492A6' } },
    },
  };

  if (loading) return <div className="loading-state card">Loading Analytics...</div>;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="header-titles">
          <h2>Analytics & Strategic Reports</h2>
          <p>Deep dive into your business growth and cart performance metrics.</p>
        </div>
      </div>

      <div className="stats-grid mb-2" style={{ marginBottom: '2.5rem' }}>
         <div className="card stat-card flex items-center gap-4">
            <div className="icon-box primary"><DollarSign size={24} /></div>
            <div>
               <span className="stat-label">Total Revenue</span>
               <h3 className="stat-value">₹{stats?.revenue}</h3>
            </div>
         </div>
         <div className="card stat-card flex items-center gap-4">
            <div className="icon-box success"><TrendingUp size={24} /></div>
            <div>
               <span className="stat-label">Net Profit</span>
               <h3 className="stat-value" style={{ color: '#00b894' }}>₹{stats?.profit}</h3>
            </div>
         </div>
         <div className="card stat-card flex items-center gap-4">
            <div className="icon-box accent"><Wallet size={24} /></div>
            <div>
               <span className="stat-label">Total Expenses</span>
               <h3 className="stat-value">₹{stats?.expenses}</h3>
            </div>
         </div>
      </div>

      <div className="charts-main-grid">
         <div className="chart-large card">
            <div className="flex justify-between items-center mb-2" style={{ marginBottom: '1.5rem' }}>
               <h3 className="chart-title">Revenue vs Expenses (Last 30 Days)</h3>
               <button className="btn btn-outline btn-xs">Generate Report</button>
            </div>
            <div className="chart-wrapper">
               <Line data={lineChartData} options={chartOptions} />
            </div>
         </div>

         <div className="charts-sub-grid">
            <div className="chart-small card">
               <h3 className="chart-title mb-2">Cart Performance</h3>
               <div className="chart-wrapper">
                  <Bar data={barChartData} options={chartOptions} />
               </div>
            </div>

            <div className="card performance-list">
               <h3 className="chart-title mb-2">Efficiency Leaderboard</h3>
               <div className="leaderboard">
                  {cartPerf.map((c, i) => (
                     <div key={i} className="leader-item flex justify-between items-center py-1">
                        <div className="flex items-center gap-2">
                           <span className="rank-idx">{i+1}.</span>
                           <span className="cart-nm font-bold">{c.cartName}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-sm font-bold">₹{c.totalSales}</span>
                           <span className="text-xs text-muted">{c.orderCount} Orders</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Reports;
