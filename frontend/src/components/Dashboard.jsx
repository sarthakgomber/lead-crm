import React from 'react';

const StatCard = ({ label, value, accent, icon, delay }) => (
  <div className="stat-card fade-in" style={{ animationDelay: delay }}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__value" style={{ color: accent }}>{value ?? '—'}</div>
    <div className="stat-card__label">{label}</div>
    <style>{`
      .stat-card {
        background: var(--white);
        border: 1px solid var(--border);
        border-top: 3px solid ${accent};
        padding: 20px;
        position: relative;
        overflow: hidden;
        transition: box-shadow var(--transition), transform var(--transition);
      }
      .stat-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, ${accent}06 0%, transparent 60%);
        pointer-events: none;
      }
      .stat-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }
      .stat-card__icon { font-size: 20px; margin-bottom: 10px; }
      .stat-card__value {
        font-family: var(--font-mono);
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 4px;
      }
      .stat-card__label {
        font-size: 11px;
        font-family: var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-muted);
      }
    `}</style>
  </div>
);

export const Dashboard = ({ stats }) => {
  if (!stats) return null;
  const cards = [
    { label: 'Total Leads',     value: stats.total,        accent: '#1d4ed8', icon: '◈', delay: '0ms'   },
    { label: 'Interested',      value: stats.interested,   accent: '#0891b2', icon: '◎', delay: '50ms'  },
    { label: 'Converted',       value: stats.converted,    accent: '#059669', icon: '◉', delay: '100ms' },
    { label: 'Not Interested',  value: stats.not_interested, accent: '#dc2626', icon: '◌', delay: '150ms' },
    { label: 'Via Call',        value: stats.from_call,    accent: '#7c3aed', icon: '◷', delay: '200ms' },
    { label: 'Via WhatsApp',    value: stats.from_whatsapp, accent: '#0d9488', icon: '◶', delay: '250ms' },
    { label: 'Via Field',       value: stats.from_field,   accent: '#b45309', icon: '◵', delay: '300ms' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <span className="dashboard__tag">{'// OVERVIEW'}</span>
      </div>
      <div className="dashboard__grid">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>
      <style>{`
        .dashboard { margin-bottom: 40px; }
        .dashboard__header { margin-bottom: 16px; }
        .dashboard__tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--blue-500);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .dashboard__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1px;
          border: 1px solid var(--border);
          background: var(--border);
        }
        .dashboard__grid > * { background: var(--white); }
      `}</style>
    </div>
  );
};