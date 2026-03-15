import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        className={`cart-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Order</h2>
          {items.length > 0 && (
            <button className="cart-clear" onClick={clearCart}>
              Clear cart
            </button>
          )}
          <button className="cart-close" onClick={onClose} aria-label="Close cart">×</button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <span>Click + on any item to add it here</span>
            </div>
          ) : (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.image_url ? (
                      <img
                        src={resolveImageUrl(item.image_url)}
                        alt={item.name}
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className="cart-item-emoji"
                      style={{ display: item.image_url ? 'none' : 'flex' }}
                    >
                      {item.emoji || '🍽️'}
                    </div>
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="cart-qty">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <button
                    className="cart-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-price">€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
