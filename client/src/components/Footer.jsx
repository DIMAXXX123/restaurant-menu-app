import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const API = import.meta.env.VITE_API_URL || '';

export default function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        {settings.maps_embed_url && (
          <div className="footer-map">
            <iframe
              src={settings.maps_embed_url}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Monochrome Café location"
            />
          </div>
        )}

        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              Mono<span>chrome</span> Café
            </div>
            <p>{t('footerTagline')}</p>
          </div>

          <div className="footer-col">
            <h4>{t('footerContact')}</h4>
            {settings.address && <p>{settings.address}</p>}
            {settings.phone && (
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            )}
          </div>

          <div className="footer-col">
            <h4>{t('footerHours')}</h4>
            {settings.hours_weekday && (
              <p>{t('footerWeekday')}: {settings.hours_weekday}</p>
            )}
            {settings.hours_weekend && (
              <p>{t('footerWeekend')}: {settings.hours_weekend}</p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footerCopyright')}</p>
          <Link to="/admin/login" className="footer-admin-link">
            {t('footerAdminLink')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
