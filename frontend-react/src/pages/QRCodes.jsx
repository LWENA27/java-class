import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useLanguage } from '../i18n/LanguageContext';
import './QRCodes.css';
import api from '../services/api';

function QRCodes() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState('');
  const [isRoom, setIsRoom] = useState(false);
  const [location, setLocation] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    setErrors([]);
    try {
      const response = await api.get('/tables');
      setTables(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrors([err.response?.data?.message || 'Failed to load tables.']);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = [];
    if (!tableNumber.trim()) errs.push(t('tableNumber') + ' ' + t('required'));
    if (tableNumber.length > 50) errs.push(t('tableNumber') + ' cannot exceed 50 chars');
    if (location.length > 100) errs.push(t('location') + ' cannot exceed 100 chars');
    if (errs.length) { setErrors(errs); return; }

    try {
      const payload = {
        tableNumber: tableNumber.trim(),
        isRoom: isRoom,
        location: location
      };
      const resp = await api.post('/tables', payload);
      setTables(prev => [...prev, resp.data]);
      setSuccess((isRoom ? t('tableTypeRoom') : t('tableTypeTable')) + ` '${tableNumber}' added successfully.`);
    } catch (err) {
      console.error('Create table error', err);
      setErrors([err.response?.data?.error || 'Failed to add table']);
      return;
    }
    setTableNumber(''); setIsRoom(false); setLocation('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('deleteConfirm') || 'Are you sure?')) return;
    try {
      await api.delete(`/tables/${id}`);
      setTables(prev => prev.filter(t => t.id !== id));
      setSuccess(t('tableTypeTable') + ' deleted successfully.');
    } catch (err) {
      console.error('Delete error', err);
      setErrors([err.response?.data?.error || 'Failed to delete table']);
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const generateQR = (id) => {
    // Use the qrCodeUrl from the backend if available, otherwise construct full URL
    const table = tables.find(t => String(t.id) === String(id));
    const dataUrl = table?.qrCodeUrl || `${window.location.origin}/customer-menu?table=${id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dataUrl)}`;
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
              <h1>{t('qrManagementTitle')}</h1>
              <p className="subtitle">{t('manageQRCodes')}</p>
            </div>
          </div>

          {success && (
            <div className="success-message"><i className="fas fa-check-circle"></i><p>{success}</p></div>
          )}

          {errors.length > 0 && (
            <div className="error-container">
              {errors.map((err, i) => <p key={i} className="error-message">{err}</p>)}
            </div>
          )}

          <div className="content-card">
            <div className="card-header"><h2>{t('addTableRoom')}</h2></div>
            <div className="card-content">
              <form onSubmit={handleAdd} className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="table_number">{t('tableNumber')}</label>
                  <input id="table_number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} maxLength={50} />
                </div>
                <div className="form-group checkbox-inline">
                  <label>
                    <input type="checkbox" checked={isRoom} onChange={(e) => setIsRoom(e.target.checked)} /> {t('isRoom')}
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="location">{t('location')}</label>
                  <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={100} />
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit"><i className="fas fa-plus"></i> {t('addTableButton')}</button>
                </div>
              </form>
            </div>
          </div>

          <div className="content-card">
            <div className="card-header"><h2>{t('manageQRCodes')}</h2></div>
            <div className="card-content">
              {loading ? (
                <div className="loading-center"><i className="fas fa-spinner fa-spin"></i><p>{t('loading')}</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th><input type="checkbox" id="select-all" /></th>
                        <th>{t('tableNumber')}</th>
                        <th>{t('status') || 'Type'}</th>
                        <th>{t('location')}</th>
                        <th>{t('qrCodes')}</th>
                        <th>{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tables.length === 0 ? (
                        <tr><td colSpan="6" className="no-data">{t('noTables')}</td></tr>
                      ) : (
                        tables.map(tbl => (
                          <tr key={tbl.id}>
                            <td><input type="checkbox" className="table-checkbox" value={tbl.id} /></td>
                            <td>{tbl.table_number}</td>
                            <td>{tbl.is_room ? t('tableTypeRoom') : t('tableTypeTable')}</td>
                            <td>{tbl.location || '-'}</td>
                            <td>
                              <a href={generateQR(tbl.id)} target="_blank" rel="noreferrer" className="qr-preview">
                                <img src={generateQR(tbl.id)} alt="QR" width="50" /> <span>{t('viewQR')}</span>
                              </a>
                            </td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tbl.id)} title={t('delete')}>{t('delete')}</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="form-actions" style={{ marginTop: 12 }}>
                <button className="btn btn-secondary" onClick={(e) => {
                  e.preventDefault();
                  // Print selected - open simple print window similar to PHP
                  const selected = Array.from(document.querySelectorAll('.table-checkbox:checked'));
                  if (selected.length === 0) { alert(t('noData')); return; }
                  const printWindow = window.open('', '_blank', 'width=800,height=600');
                  printWindow.document.write('<html><head><title>Print QR Codes</title>');
                  printWindow.document.write('<style>body{font-family:Arial,Helvetica,sans-serif}.qr-container{display:inline-block;margin:20px;text-align:center}.qr-code{border:1px solid #ddd;padding:15px;background:#fff}.qr-code img{width:200px;height:200px}</style>');
                  printWindow.document.write('</head><body>');
                  selected.forEach(cb => {
                    const row = cb.closest('tr');
                    const number = row.querySelector('td:nth-child(2)').textContent;
                    const img = row.querySelector('.qr-preview img').src;
                    printWindow.document.write(`<div class="qr-container"><div class="qr-code"><img src="${img}"/></div><div class="qr-info">${number}</div></div>`);
                  });
                  printWindow.document.write('</body></html>');
                  printWindow.document.close();
                }}>{t('printSelectedQRCodes')}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QRCodes;
