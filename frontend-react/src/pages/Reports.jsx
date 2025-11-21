import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useLanguage } from '../i18n/LanguageContext';
import './Reports.css';

function Reports() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [errors, setErrors] = useState([]);

  // Mock data - replace with API calls
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersByStatus, setOrdersByStatus] = useState({});
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setErrors([]);

    try {
      // TODO: Replace with real API call(s)
      // Example: GET /api/reports?date_from=...&date_to=...

      // Mock totals
      const mockTotalRevenue = 1250000.5; // TZS
      const mockTotalOrders = 234;
      const mockOrdersByStatus = {
        pending: 12,
        confirmed: 34,
        preparing: 20,
        ready: 18,
        delivered: 140,
        cancelled: 10
      };

      const mockTopItems = [
        { name: 'Ugali & Fish', total_quantity: 120, total_revenue: 180000 },
        { name: 'Chips Mayai', total_quantity: 95, total_revenue: 57000 },
        { name: 'Pilau', total_quantity: 70, total_revenue: 105000 }
      ];

      // Simulate network latency
      setTimeout(() => {
        setTotalRevenue(mockTotalRevenue);
        setTotalOrders(mockTotalOrders);
        setOrdersByStatus(mockOrdersByStatus);
        setTopItems(mockTopItems);
        setLoading(false);
      }, 400);
    } catch (err) {
      console.error('Failed to load reports', err);
      setErrors(['Failed to load reports.']);
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // For now just reload mock data; in real app, call API with date params
    loadReportData();
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="admin-container">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="main-wrapper">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="main-content">
          <div className="page-header">
            <div className="header-content">
              <h1>{t('salesReports')}</h1>
              <p className="subtitle">{t('filterReports')}</p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="error-container">
              {errors.map((err, idx) => (
                <p key={idx} className="error-message">{err}</p>
              ))}
            </div>
          )}

          <div className="dashboard-card">
            <div className="card-header">
              <h2>{t('filterReports')}</h2>
            </div>
            <form className="filter-form" onSubmit={handleFilter}>
              <div className="form-group">
                <label htmlFor="date_from">{t('from')}</label>
                <input id="date_from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="date_to">{t('to')}</label>
                <input id="date_to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary btn-small" type="submit">{t('filter')}</button>
                <button type="button" className="btn btn-secondary btn-small" onClick={() => { setDateFrom(''); setDateTo(''); }}>{t('clearFilter')}</button>
              </div>
            </form>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>{t('keyMetrics') || 'Key Metrics'}</h2>
            </div>
            {loading ? (
              <div className="loading-center">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>{t('loadingDashboard') || 'Loading...'}</p>
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{t('totalRevenue')}</h3>
                  <p>{Number(totalRevenue).toLocaleString()} TZS</p>
                </div>
                <div className="stat-card">
                  <h3>{t('totalOrders')}</h3>
                  <p>{totalOrders}</p>
                </div>
                {Object.keys(ordersByStatus).map((status) => (
                  <div key={status} className="stat-card">
                    <h3>{t(status) || status}</h3>
                    <p>{ordersByStatus[status]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>{t('topSellingItems')}</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('item') || 'Item Name'}</th>
                  <th>{t('unitsSold') || 'Quantity Sold'}</th>
                  <th>{t('totalRevenue') || 'Total Revenue (TZS)'}</th>
                </tr>
              </thead>
              <tbody>
                {topItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-data">{t('noSalesData')}</td>
                  </tr>
                ) : (
                  topItems.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.name}</td>
                      <td>{it.total_quantity}</td>
                      <td>{Number(it.total_revenue).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;
