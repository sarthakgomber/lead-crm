import React, { useState } from 'react';

const STATUS_META = {
  'Interested':     { color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', dot: '#0891b2' },
  'Not Interested': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#dc2626' },
  'Converted':      { color: '#059669', bg: '#f0fdf4', border: '#86efac', dot: '#059669' },
};

const SOURCE_ICONS = { Call: '📞', WhatsApp: '💬', Field: '🗺' };

export const LeadCard = ({ lead, onUpdateStatus, onDelete, index }) => {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const meta = STATUS_META[lead.status] || STATUS_META['Interested'];
  const dateStr = new Date(lead.created_at).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const handleStatus = async (e) => {
    setUpdating(true);
    try { await onUpdateStatus(lead.id, e.target.value); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete lead "${lead.name}"?`)) return;
    setDeleting(true);
    try { await onDelete(lead.id); }
    finally { setDeleting(false); }
  };

  return (
    <div
      className="lc fade-in"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className="lc__top">
        <div className="lc__id">#{String(lead.id).padStart(4, '0')}</div>
        <div className="lc__date">{dateStr}</div>
      </div>

      <div className="lc__name">{lead.name}</div>
      <div className="lc__phone">{lead.phone}</div>

      <div className="lc__source">
        <span>{SOURCE_ICONS[lead.source]} {lead.source}</span>
      </div>

      {lead.notes && <div className="lc__notes">{lead.notes}</div>}

      <div className="lc__footer">
        <div className="lc__status-wrap">
          <span
            className="lc__dot"
            style={{ background: meta.dot, animation: lead.status === 'Interested' ? 'pulse-dot 2s ease infinite' : 'none' }}
          />
          <select
            className="lc__status-select"
            value={lead.status}
            onChange={handleStatus}
            disabled={updating}
            style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
          >
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Converted">Converted</option>
          </select>
        </div>

        <button
          className="lc__delete"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete lead"
        >
          {deleting ? '...' : '✕'}
        </button>
      </div>

      <style>{`
        .lc {
          background: var(--white);
          border: 1px solid var(--border);
          border-left: 3px solid var(--blue-400);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: box-shadow var(--transition), transform var(--transition), border-color var(--transition);
          position: relative;
        }
        .lc::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, var(--blue-50) 0%, transparent 50%);
          opacity: 0;
          transition: opacity var(--transition);
          pointer-events: none;
        }
        .lc:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--blue-300); }
        .lc:hover::after { opacity: 1; }
        .lc__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lc__id {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--blue-400);
          letter-spacing: 0.1em;
        }
        .lc__date {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
        }
        .lc__name {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .lc__phone {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--blue-600);
          letter-spacing: 0.04em;
        }
        .lc__source {
          font-size: 12px;
          color: var(--text-muted);
        }
        .lc__notes {
          font-size: 12px;
          color: var(--text-muted);
          background: var(--blue-50);
          border: 1px solid var(--border);
          padding: 8px 10px;
          border-radius: var(--radius);
          line-height: 1.5;
        }
        .lc__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          gap: 8px;
        }
        .lc__status-wrap { display: flex; align-items: center; gap: 6px; flex: 1; }
        .lc__dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .lc__status-select {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          border: 1px solid;
          border-radius: var(--radius);
          padding: 4px 8px;
          cursor: pointer;
          flex: 1;
          min-width: 0;
        }
        .lc__status-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
        .lc__delete {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-muted);
          width: 28px; height: 28px;
          border-radius: var(--radius);
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition);
        }
        .lc__delete:hover:not(:disabled) {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
};
