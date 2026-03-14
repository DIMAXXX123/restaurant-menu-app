import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage';
import Footer from './components/Footer';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import MenuAdmin from './pages/admin/MenuAdmin';
import Reservations from './pages/admin/Reservations';
import Settings from './pages/admin/Settings';
import Sidebar from './components/admin/Sidebar';
import ScrollToTop from './components/ScrollToTop';

function AdminLayout({ children }) {
  const token = localStorage.getItem('cafe_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Hero />
      <MenuPage />
      <ReservationPage />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/menu" element={<AdminLayout><MenuAdmin /></AdminLayout>} />
      <Route path="/admin/reservations" element={<AdminLayout><Reservations /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
