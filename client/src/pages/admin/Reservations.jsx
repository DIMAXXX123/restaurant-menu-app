import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${localStorage.getItem('cafe_token')}`, ...extra };
}

const STATUS_FILTERS = ['all', 'pending', 'accepted', 'rejected'];

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reservations', { headers: authHeaders() });
      if (res.status === 401) { navigate('/admin/login'); return; }
      setReservations(await res.json());
    } catch (e) {
      showAlert('error', 'Failed to load reservations');
    }
    setLoading(false);
  };

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setReservations((prev) => prev.map((r) => r.id === updated.id ? updated : r));
      showAlert('success', `Reservation ${status}`);
    } catch {
      showAlert('error', 'Failed to update status');
    }
  };

  const deleteReservation = async (id) => {
    if (!confirm('Delete this reservation?')) return;
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        showAlert('success', 'Reservation deleted');
      }
    } catch {
      showAlert('error', 'Failed to delete');
    }
  };

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    accepted: reservations.filter((r) => r.status === 'accepted').length,
    rejected: reservations.filter((r) => r.status === 'rejected').length,
  };

  const filtered = reservations
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return r.guest_name.toLowerCase().includes(q) || (r.phone || '').includes(q) || (r.email || '').toLowerCase().includes(q);
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reservations</h1>
          <p className="page-subtitle">{reservations.length} total reservations</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchReservations}>↻ Refresh</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:20 }}>
        <div className="filter-tabs">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="tab-count">{counts[s]}</span>
            </button>
          ))}
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="table-responsive">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-text">No reservations found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Contact</th>
                  <th>Date & Time</th>
                  <th>Guests</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.guest_name}</strong>
                      <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>
                        #{r.id} · {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      {r.phone && <div>{r.phone}</div>}
                      {r.email && <div style={{ fontSize:'0.8rem', color:'var(--muted)' }}>{r.email}</div>}
                    </td>
                    <td>
                      <strong>{formatDate(r.date)}</strong>
                      <div style={{ fontSize:'0.82rem', color:'var(--muted)' }}>{r.time?.slice(0,5)}</div>
                    </td>
                    <td style={{ textAlign:'center' }}>{r.guests}</td>
                    <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.82rem', color:'var(--muted)' }}>
                      {r.notes || '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${r.status}`}>{r.status}</span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {r.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => updateStatus(r.id, 'accepted')}
                              title="Accept"
                            >✓</button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateStatus(r.id, 'rejected')}
                              title="Reject"
                            >✗</button>
                          </>
                        )}
                        {r.status !== 'pending' && (
                          <span style={{ fontSize:'0.75rem', color:'var(--muted)', padding:'4px 8px' }}>
                            {r.status === 'accepted' ? '✓ Done' : '✗ Done'}
                          </span>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteReservation(r.id)}
                          title="Delete"
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
