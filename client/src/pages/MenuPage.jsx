import React, { useEffect, useState } from 'react';
import MenuGrid from '../components/MenuGrid';
import { useTranslation } from '../hooks/useTranslation';

export default function MenuPage() {
  const { t } = useTranslation();
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(setMenuData)
      .catch(() => setError(t('menuError')));
  }, []);

  if (error) {
    return (
      <div className="menu-page">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <p className="empty-state-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="menu-page">
        <div className="loading-spinner">{t('menuLoading')}</div>
      </div>
    );
  }

  return (
    <section className="menu-page" id="menu">
      <MenuGrid menuData={menuData} />
    </section>
  );
}
