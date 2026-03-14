import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';
const CATEGORIES = ['popular','hot-drinks','cold-drinks','breakfast','light-bites','sandwiches','mains','desserts'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'popular', emoji: '🍽️', image_url: '', available: true };

function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${localStorage.getItem('cafe_token')}`, ...extra };
}

export default function MenuAdmin() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/menu/all', { headers: authHeaders() });
      if (res.status === 401) { navigate('/admin/login'); return; }
      setItems(await res.json());
    } catch (e) { showAlert('error', 'Failed to load items'); }
    setLoading(false);
  };

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setPreviewUrl('');
    setEditId(null);
    setModal('add');
  };

  const openEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      emoji: item.emoji || '🍽️',
      image_url: item.image_url || '',
      available: item.available,
    });
    setPreviewUrl(item.image_url ? `${API}${item.image_url}` : '');
    setEditId(item.id);
    setModal('edit');
  };

  const closeModal = () => { setModal(null); setEditId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, image_url: data.url }));
      setPreviewUrl(`${API}${data.url}`);
    } catch (err) {
      showAlert('error', err.message || 'Upload failed');
    }
    setImgUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = modal === 'edit' ? `/api/menu/${editId}` : '/api/menu';
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showAlert('success', modal === 'edit' ? 'Item updated' : 'Item created');
      closeModal();
      fetchItems();
    } catch (err) {
      showAlert('error', err.message || 'Save failed');
    }
    setSaving(false);
  };

  const toggleAvailability = async (item) => {
    try {
      const res = await fetch(`/api/menu/${item.id}/availability`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
      }
    } catch (e) {}
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showAlert('success', 'Item deleted');
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {}
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Editor</h1>
          <p className="page-subtitle">{items.length} items total</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={openAdd}>+ Add Item</button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <div className="admin-table-wrap">
        <div className="table-responsive">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <p className="empty-state-text">No menu items yet. Add your first item!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img
                          src={`${API}${item.image_url}`}
                          alt={item.name}
                          className="image-preview"
                          onError={(e) => { e.target.style.display='none'; }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.6rem' }}>{item.emoji}</span>
                      )}
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                      {item.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', maxWidth: 240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-pending" style={{ textTransform:'capitalize' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>€{Number(item.price).toFixed(2)}</td>
                    <td>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={() => toggleAvailability(item)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{modal === 'edit' ? 'Edit Item' : 'Add New Item'}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Cappuccino" />
                  </div>
                  <div className="admin-form-group">
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Price (€) *</label>
                    <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="0.00" />
                  </div>
                  <div className="admin-form-group">
                    <label>Emoji</label>
                    <input name="emoji" value={form.emoji} onChange={handleChange} placeholder="🍽️" style={{ fontSize: '1.2rem' }} />
                  </div>
                  <div className="admin-form-group" style={{ display:'flex', alignItems:'center', gap:10, flexDirection:'row', paddingTop:24 }}>
                    <label className="toggle" style={{ marginBottom:0 }}>
                      <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                      <span className="toggle-slider" />
                    </label>
                    <span style={{ fontSize:'0.88rem', color:'var(--muted)' }}>Available</span>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief, appetising description..." />
                </div>

                <div className="admin-form-group">
                  <label>Image</label>
                  <label className="image-upload-area">
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} />
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" style={{ maxHeight:120, borderRadius:8 }} />
                    ) : (
                      <>
                        <div style={{ fontSize:'1.8rem' }}>📷</div>
                        <div className="upload-hint">Click to upload · JPG, PNG, WEBP · max 5MB</div>
                      </>
                    )}
                  </label>
                  {imgUploading && <div style={{ fontSize:'0.82rem', color:'var(--muted)', marginTop:6 }}>Uploading...</div>}
                  {previewUrl && (
                    <button type="button" className="btn btn-danger btn-sm" style={{ marginTop:6 }}
                      onClick={() => { setPreviewUrl(''); setForm((f) => ({ ...f, image_url: '' })); }}>
                      Remove image
                    </button>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : modal === 'edit' ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
