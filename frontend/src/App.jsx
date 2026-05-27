import React, { useState, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { AddLeadForm } from './components/AddLeadForm';
import { LeadsList } from './components/LeadsList';
import { useLeads } from './hooks/useLeads';

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const { leads, stats, loading, error, addLead, updateStatus, deleteLead, refetch } = useLeads();

  const handleAdd = useCallback(async (data) => {
    await addLead(data);
    setShowForm(false);
  }, [addLead]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner container">
          <div className="app-logo">
            <div className="app-logo__mark">◈</div>
            <div>
              <div className="app-logo__name">LEAD CRM</div>
              <div className="app-logo__sub">Management System v1.0</div>
            </div>
          </div>
          <div className="app-header__actions">
            <button className="btn-refresh" onClick={refetch} title="Refresh">
              ↻ Refresh
            </button>
            <button
              className={`btn-add ${showForm ? 'btn-add--active' : ''}`}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? '✕ Cancel' : '+ New Lead'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main container">
        {error && (
          <div className="app-error">
            <strong>⚠ Connection Error:</strong> {error}
            <button onClick={refetch} style={{ marginLeft: 12, textDecoration: 'underline', background: 'none', color: 'inherit' }}>Retry</button>
          </div>
        )}

        <Dashboard stats={stats} />

        <div className="app-layout">
          <div className={`app-form-col ${showForm ? 'app-form-col--open' : ''}`}>
            {showForm && (
              <AddLeadForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
            )}
          </div>
          <div className="app-list-col">
            <LeadsList
              leads={leads}
              loading={loading}
              onUpdateStatus={updateStatus}
              onDelete={deleteLead}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <span className="app-footer__text">// LEAD CRM — Sankar Group Assignment</span>
          <span className="app-footer__status">
            <span className="app-footer__dot" />
            System Online
          </span>
        </div>
      </footer>

      <style>{`
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .app-header {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 3px;
          z-index: 50;
          backdrop-filter: blur(8px);
        }
        .app-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .app-logo { display: flex; align-items: center; gap: 14px; }
        .app-logo__mark {
          font-size: 28px;
          color: var(--blue-500);
          font-family: var(--font-mono);
          line-height: 1;
        }
        .app-logo__name {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.16em;
          color: var(--text-primary);
        }
        .app-logo__sub {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
        .app-header__actions { display: flex; gap: 8px; }
        .btn-refresh {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 8px 14px;
          border-radius: var(--radius);
          text-transform: uppercase;
        }
        .btn-refresh:hover {
          background: var(--blue-50);
          color: var(--blue-600);
          border-color: var(--blue-200);
        }
        .btn-add {
          background: var(--blue-500);
          color: var(--white);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 8px 18px;
          border-radius: var(--radius);
          text-transform: uppercase;
          transition: all var(--transition);
        }
        .btn-add:hover {
          background: var(--blue-600);
          box-shadow: 0 4px 12px rgba(29,78,216,0.3);
        }
        .btn-add--active {
          background: var(--blue-100);
          color: var(--blue-700);
          border: 1px solid var(--blue-200);
          box-shadow: none;
        }
        .btn-add--active:hover { background: var(--blue-200); box-shadow: none; }

        /* Main */
        .app-main { padding-top: 40px; padding-bottom: 60px; }
        .app-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: var(--radius);
          font-size: 13px;
          margin-bottom: 28px;
          font-family: var(--font-mono);
        }

        /* Layout */
        .app-layout { display: flex; flex-direction: column; gap: 32px; }
        .app-form-col { transition: all 0.3s ease; }
        .app-list-col { flex: 1; }

        /* Footer */
        .app-footer {
          border-top: 1px solid var(--border);
          padding: 16px 0;
          background: var(--white);
        }
        .app-footer .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .app-footer__text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
        .app-footer__status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: #059669;
          letter-spacing: 0.08em;
        }
        .app-footer__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #059669;
          animation: pulse-dot 2s ease infinite;
        }

        @media (min-width: 900px) {
          .app-layout { flex-direction: row; align-items: flex-start; }
          .app-form-col {
            width: 0;
            overflow: hidden;
            flex-shrink: 0;
          }
          .app-form-col--open {
            width: 360px;
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
}
