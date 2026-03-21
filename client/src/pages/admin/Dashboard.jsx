import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://restaurant-menu-app-378x.onrender.com';

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('cafe_token')}` };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, menuItems: 0 });
  const [recent, setRecent] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resvRes, menuRes, adminRes] = await Promise.all([
          fetch(`${API}/api/reservations`, { headers: authHeaders() }),
          fetch(`${API}/api/menu/all`, { headers: authHeaders() }),
          fetch(`${API}/api/auth/me`, { headers: authHeaders() }),
        ]);

        if (resvRes.status === 401 || adminRes.status === 401) {
          localStorage.removeItem('cafe_token');
          navigate('/admin/login');
          return;
        }

        const reservations = await resvRes.json();
        const menu = await menuRes.json();
        const adminData = await adminRes.json();

        setAdmin(adminData);
        setRecent(reservations.slice(0, 8));
        setStats({
          total: reservations.length,
          pending: reservations.filter((r) => r.status === 'pending').length,
          accepted: reservations.filter((r) => r.status === 'accepted').length,
          menuItems: menu.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          {admin && (
            <p className="page-subtitle">Welcome back, {admin.username}</p>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Reservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value" style={{ color: 'var(--gold-d)' }}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{stats.menuItems}</div>
          <div className="stat-label">Menu Items</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Recent Reservations</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/admin/reservations')}
          >
            View all →
          </button>
        </div>
        <div className="table-responsive">
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-text">No reservations yet</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.guest_name}</strong>
                      {r.phone && <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{r.phone}</div>}
                    </td>
                    <td>{formatDate(r.date)}</td>
                    <td>{r.time?.slice(0,5)}</td>
                    <td>{r.guests}</td>
                    <td>
                      <span className={`badge badge-${r.status}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/admin/menu')}>
          🍽️ Edit Menu
        </button>
        <button className="btn btn-gold btn-lg" onClick={() => navigate('/admin/reservations')}>
          📅 View Reservations
        </button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/admin/settings')}>
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}
