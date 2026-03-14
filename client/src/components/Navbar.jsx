import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { languageLabels } from '../i18n';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const CATEGORIES = [
  { key: 'popular',     labelKey: 'catPopular' },
  { key: 'hot-drinks',  labelKey: 'catHotDrinks' },
  { key: 'cold-drinks', labelKey: 'catColdDrinks' },
  { key: 'breakfast',   labelKey: 'catBreakfast' },
  { key: 'light-bites', labelKey: 'catLightBites' },
  { key: 'sandwiches',  labelKey: 'catSandwiches' },
  { key: 'mains',       labelKey: 'catMains' },
  { key: 'desserts',    labelKey: 'catDesserts' },
];

export default function Navbar() {
  const { t, lang, cycleLang } = useTranslation();
  const { totalCount } = useCart();
  const [active, setActive] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.dataset.section);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    CATEGORIES.forEach(({ key }) => {
      const el = document.querySelector(`[data-section="${key}"]`);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(`[data-section="${id}"]`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="navbar-logo" onClick={scrollToTop} aria-label="Back to top">
            Mono<span>chrome</span> Café
          </button>

          <div className="navbar-categories">
            {CATEGORIES.map(({ key, labelKey }) => (
              <button
                key={key}
                className={`cat-pill ${active === key ? 'active' : ''}`}
                onClick={() => scrollTo(key)}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          <div className="navbar-actions">
            <button className="btn-translate" onClick={cycleLang} title="Change language">
              {languageLabels[lang]}
            </button>

            <button
              className="btn-cart"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              title="Cart"
            >
              🛒
              {totalCount > 0 && (
                <span className="cart-badge">{totalCount}</span>
              )}
            </button>

            <button className="btn-reserve" onClick={scrollToReservation}>
              {t('navReserve')}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
