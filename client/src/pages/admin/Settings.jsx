import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://restaurant-menu-app-378x.onrender.com';

function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${localStorage.getItem('cafe_token')}`, ...extra };
}

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    cafe_name: '', phone: '', email: '', address: '',
    hours_weekday: '', hours_weekend: '', maps_embed_url: '',
  });
  const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [alert, setAlert] = useState(null);
  const [pwAlert, setPwAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings`, { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401) { navigate('/admin/login'); return; }
        return r.json();
      })
      .then((data) => data && setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const showAlert = (setter, type, msg) => {
    setter({ type, msg });
    setTimeout(() => setter(null), 4000);
  };

  const handleSettingChange = (e) => {
    setSettings((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showAlert(setAlert, 'success', 'Settings saved successfully');
    } catch (err) {
      showAlert(setAlert, 'error', err.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handlePwChange = (e) => {
    setPw((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      showAlert(setPwAlert, 'error', 'New passwords do not match');
      return;
    }
    if (pw.newPassword.length < 6) {
      showAlert(setPwAlert, 'error', 'Password must be at least 6 characters');
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ oldPassword: pw.oldPassword, newPassword: pw.newPassword }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setPw({ oldPassword: '', newPassword: '', confirm: '' });
      showAlert(setPwAlert, 'success', 'Password changed successfully');
    } catch (err) {
      showAlert(setPwAlert, 'error', err.message || 'Failed to change password');
    }
    setSavingPw(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage café information and account</p>
        </div>
      </div>

      {/* Café Info */}
      <div className="form-card">
        <div className="form-card-title">Café Information</div>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
        <form onSubmit={saveSettings}>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Café Name</label>
              <input name="cafe_name" value={settings.cafe_name} onChange={handleSettingChange} />
            </div>
            <div className="admin-form-group">
              <label>Phone</label>
              <input name="phone" value={settings.phone} onChange={handleSettingChange} />
            </div>
            <div className="admin-form-group">
              <label>Email</label>
              <input name="email" type="email" value={settings.email} onChange={handleSettingChange} />
            </div>
            <div className="admin-form-group">
              <label>Address</label>
              <input name="address" value={settings.address} onChange={handleSettingChange} />
            </div>
            <div className="admin-form-group">
              <label>Weekday Hours</label>
              <input name="hours_weekday" value={settings.hours_weekday} onChange={handleSettingChange} placeholder="08:00 – 22:00" />
            </div>
            <div className="admin-form-group">
              <label>Weekend Hours</label>
              <input name="hours_weekend" value={settings.hours_weekend} onChange={handleSettingChange} placeholder="09:00 – 23:00" />
            </div>
          </div>
          <div className="admin-form-group">
            <label>Google Maps Embed URL</label>
            <input name="maps_embed_url" value={settings.maps_embed_url} onChange={handleSettingChange} placeholder="https://maps.google.com/maps?q=...&output=embed" />
          </div>
          {settings.maps_embed_url && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:6 }}>Map Preview:</div>
              <div style={{ height:160, borderRadius:8, overflow:'hidden', border:'1px solid var(--border)' }}>
                <iframe src={settings.maps_embed_url} width="100%" height="100%" style={{ border:0 }} loading="lazy" title="Map preview" />
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="form-card">
        <div className="form-card-title">Change Password</div>
        {pwAlert && <div className={`alert alert-${pwAlert.type}`}>{pwAlert.msg}</div>}
        <form onSubmit={savePassword}>
          <div className="admin-form-group">
            <label>Current Password</label>
            <input name="oldPassword" type="password" value={pw.oldPassword} onChange={handlePwChange} required autoComplete="current-password" />
          </div>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>New Password</label>
              <input name="newPassword" type="password" value={pw.newPassword} onChange={handlePwChange} required autoComplete="new-password" />
            </div>
            <div className="admin-form-group">
              <label>Confirm New Password</label>
              <input name="confirm" type="password" value={pw.confirm} onChange={handlePwChange} required autoComplete="new-password" />
            </div>
          </div>
          <button type="submit" className="btn btn-gold" disabled={savingPw}>
            {savingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
