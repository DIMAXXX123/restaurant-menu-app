import React from 'react';
import MenuCard from './MenuCard';
import { useTranslation } from '../hooks/useTranslation';

const CATEGORY_LABELS = {
  'popular':     'catPopular',
  'hot-drinks':  'catHotDrinks',
  'cold-drinks': 'catColdDrinks',
  'breakfast':   'catBreakfast',
  'light-bites': 'catLightBites',
  'sandwiches':  'catSandwiches',
  'mains':       'catMains',
  'desserts':    'catDesserts',
};

const CATEGORY_ORDER = [
  'popular', 'hot-drinks', 'cold-drinks', 'breakfast',
  'light-bites', 'sandwiches', 'mains', 'desserts',
];

export default function MenuGrid({ menuData }) {
  const { t } = useTranslation();

  return (
    <div>
      {CATEGORY_ORDER.map((cat) => {
        const items = menuData[cat];
        if (!items || items.length === 0) return null;
        return (
          <section
            key={cat}
            className="menu-section"
            data-section={cat}
            id={`section-${cat}`}
            style={{ animationDelay: `${CATEGORY_ORDER.indexOf(cat) * 0.15}s` }}
          >
            <div className="section-header">
              <h2 className="section-title">{t(CATEGORY_LABELS[cat])}</h2>
              <span className="section-count">
                {items.length} {t('menuItems')}
              </span>
            </div>
            <div className="menu-grid">
              {items.map((item, idx) => (
                <MenuCard key={item.id} item={item} delay={idx * 0.08} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
