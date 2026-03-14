import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/admin/dashboard',    icon: '▦',  label: 'Dashboard' },
  { path: '/admin/menu',         icon: '🍽',  label: 'Menu Editor' },
  { path: '/admin/reservations', icon: '📅', label: 'Reservations' },
  { path: '/admin/settings',     icon: '⚙',  label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cafe_token');
    navigate('/admin/login');
  };

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            Mono<span>chrome</span>
          </div>
          <div className="sidebar-subtitle">Admin Panel</div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ path, icon, label }) => (
            <button
              key={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => handleNav(path)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="btn-view-site"
            onClick={() => { window.open('/', '_blank'); setOpen(false); }}
          >
            ↗ View Site
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
