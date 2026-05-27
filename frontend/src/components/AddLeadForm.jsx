import React, { useState } from 'react';

const initialState = { name: '', phone: '', source: '', notes: '' };

export const AddLeadForm = ({ onAdd, onClose }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Min 2 characters';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(form.phone)) e.phone = 'Invalid phone format';
    if (!form.source) e.source = 'Source is required';
    return e;
  };

  const handle = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => { const n = { ...err }; delete n[field]; return n; });
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await onAdd(form);
      setForm(initialState);
      setToast('✓ Lead added successfully');
      setTimeout(() => { setToast(null); if (onClose) onClose(); }, 1400);
    } catch (err) {
      setToast(`✕ ${err.message}`);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-wrap fade-in">
      <div className="form-header">
        <div>
          <div className="form-tag">{'// NEW ENTRY'}</div>
          <h2 className="form-title">Add Lead</h2>
        </div>
        {onClose && (
          <button className="form-close" onClick={onClose} aria-label="Close">✕</button>
        )}
      </div>

      <div className="form-body">
        <Field label="Name" error={errors.name}>
          <input
            className={`f-input ${errors.name ? 'f-input--error' : ''}`}
            placeholder="Full name"
            value={form.name}
            onChange={handle('name')}
          />
        </Field>

        <Field label="Phone" error={errors.phone}>
          <input
            className={`f-input ${errors.phone ? 'f-input--error' : ''}`}
            placeholder="+91 98000 00000"
            value={form.phone}
            onChange={handle('phone')}
          />
        </Field>

        <Field label="Source" error={errors.source}>
          <select
            className={`f-input f-select ${errors.source ? 'f-input--error' : ''}`}
            value={form.source}
            onChange={handle('source')}
          >
            <option value="">Select source</option>
            <option value="Call">📞 Call</option>
            <option value="WhatsApp">💬 WhatsApp</option>
            <option value="Field">🗺 Field</option>
          </select>
        </Field>

        <Field label="Notes (optional)">
          <textarea
            className="f-input f-textarea"
            placeholder="Any notes about this lead..."
            value={form.notes}
            onChange={handle('notes')}
            rows={3}
          />
        </Field>

        <button
          className="f-submit"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? <span className="f-spinner" /> : '+ ADD LEAD'}
        </button>

        {toast && (
          <div className={`f-toast ${toast.startsWith('✓') ? 'f-toast--ok' : 'f-toast--err'}`}>
            {toast}
          </div>
        )}
      </div>

      <style>{`
        .form-wrap {
          background: var(--white);
          border: 1px solid var(--border-strong);
          border-top: 3px solid var(--blue-500);
          padding: 28px;
          position: relative;
        }
        .form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .form-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--blue-400);
          letter-spacing: 0.12em;
          margin-bottom: 4px;
        }
        .form-title {
          font-size: 20px;
          color: var(--text-primary);
        }
        .form-close {
          background: none;
          color: var(--text-muted);
          font-size: 14px;
          padding: 4px 8px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: all var(--transition);
        }
        .form-close:hover {
          background: var(--blue-50);
          color: var(--blue-500);
          border-color: var(--blue-300);
        }
        .form-body { display: flex; flex-direction: column; gap: 16px; }
        .f-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 14px;
          color: var(--text-primary);
          background: var(--off-white);
          font-family: var(--font-sans);
        }
        .f-input:focus {
          border-color: var(--blue-400);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .f-input--error { border-color: #dc2626 !important; }
        .f-select { appearance: none; cursor: pointer; }
        .f-textarea { resize: vertical; min-height: 72px; }
        .f-submit {
          padding: 12px;
          background: var(--blue-500);
          color: var(--white);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }
        .f-submit:hover:not(:disabled) {
          background: var(--blue-600);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
        }
        .f-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .f-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        .f-toast {
          padding: 10px 14px;
          border-radius: var(--radius);
          font-size: 13px;
          font-family: var(--font-mono);
          animation: fadeIn 0.2s ease;
        }
        .f-toast--ok { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .f-toast--err { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
      `}</style>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div className="f-field">
    <label className="f-label">{label}</label>
    {children}
    {error && <span className="f-error">{error}</span>}
    <style>{`
      .f-field { display: flex; flex-direction: column; gap: 5px; }
      .f-label {
        font-family: var(--font-mono);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-secondary);
      }
      .f-error { font-size: 11px; color: #dc2626; font-family: var(--font-mono); }
    `}</style>
  </div>
);