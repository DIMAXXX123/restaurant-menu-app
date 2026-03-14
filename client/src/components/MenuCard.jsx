import React from 'react';
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL || '';

export default function MenuCard({ item }) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(item.id);

  const handleToggle = () => {
    if (inCart) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <article className="menu-card">
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
          <p className="card-desc">{item.description}</p>
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
