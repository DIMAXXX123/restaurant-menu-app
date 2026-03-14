import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function Hero() {
  const { t } = useTranslation();

  const scrollToMenu = () => {
    const el = document.querySelector('[data-section="popular"]');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-dot-grid" />
      <div className="hero-glow" />
      <div className="hero-content">
        <div className="hero-tag">{t('heroTag')}</div>
        <h1 className="hero-title">
          {t('heroTitle1')} <em>{t('heroTitleAccent')}</em>
        </h1>
        <p className="hero-sub">{t('heroSub')}</p>
        <div className="hero-buttons">
          <button className="btn-hero-primary" onClick={scrollToMenu}>
            {t('heroViewMenu')}
          </button>
          <button className="btn-hero-secondary" onClick={scrollToReservation}>
            {t('heroReserve')}
          </button>
        </div>
      </div>
    </section>
  );
}
