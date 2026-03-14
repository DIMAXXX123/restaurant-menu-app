import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL || '';

export default function MenuCard({ item, delay = 0 }) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(item.id);
  const [descExpanded, setDescExpanded] = useState(false);

  const handleToggle = () => {
    if (inCart) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const hasLongDesc = item.description && item.description.length > 80;

  const handleDescClick = () => {
    if (hasLongDesc && !descExpanded) {
      setDescExpanded(true);
    }
  };

  return (
    <article className="menu-card" style={{ animationDelay: `${delay}s` }}>
      <div className="card-image">
        {item.image_url ? (
          <img
            src={`${API}${item.image_url}`}
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              e.target.parentElement.innerHTML = `<div class="card-emoji-bg">${item.emoji || '🍽️'}</div>`;
            }}
          />
        ) : (
          <div className="card-emoji-bg">{item.emoji || '🍽️'}</div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-name">{item.name}</h3>
        {item.description && (
          <p 
            className={`card-desc ${descExpanded ? 'expanded' : ''}`}
            onClick={handleDescClick}
          >
            {item.description}
          </p>
        )}
        <div className="card-footer">
          <span className="card-price">€{Number(item.price).toFixed(2)}</span>
          <button
            className={`btn-add ${inCart ? 'in-cart' : ''}`}
            onClick={handleToggle}
            aria-label={inCart ? `Remove ${item.name} from cart` : `Add ${item.name} to cart`}
            title={inCart ? 'Remove from cart' : 'Add to cart'}
          >
            {inCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    </article>
  );
}
