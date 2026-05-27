import React, { useState } from 'react';
import { LeadCard } from './LeadCard';

export const LeadsList = ({ leads, loading, onUpdateStatus, onDelete }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const filtered = leads.filter((l) => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchSource = !sourceFilter || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="ll">
      <div className="ll__header">
        <div className="ll__title-row">
          <div>
            <div className="ll__tag">{'// LEADS'}</div>
            <h2 className="ll__title">
              {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'record' : 'records'}`}
            </h2>
          </div>
        </div>

        <div className="ll__filters">
          <div className="ll__search-wrap">
            <span className="ll__search-icon">⌕</span>
            <input
              className="ll__search"
              placeholder="Search name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ll__clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <select
            className="ll__filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Converted">Converted</option>
          </select>

          <select
            className="ll__filter-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="Call">Call</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Field">Field</option>
          </select>

          {(statusFilter || sourceFilter || search) && (
            <button
              className="ll__reset"
              onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="ll__empty">
          <div className="ll__loader" />
          <span>Fetching records...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ll__empty">
          <div className="ll__empty-icon">◌</div>
          <div className="ll__empty-title">No leads found</div>
          <div className="ll__empty-sub">
            {leads.length === 0 ? 'Add your first lead using the form' : 'Try adjusting your filters'}
          </div>
        </div>
      ) : (
        <div className="ll__grid">
          {filtered.map((lead, i) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              index={i}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <style>{`
        .ll { }
        .ll__header { margin-bottom: 24px; }
        .ll__title-row { margin-bottom: 16px; }
        .ll__tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--blue-500);
          letter-spacing: 0.12em;
        }
        .ll__title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 4px;
        }
        .ll__filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .ll__search-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 200px;
          position: relative;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0 10px;
        }
        .ll__search-wrap:focus-within {
          border-color: var(--blue-400);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .ll__search-icon { color: var(--text-muted); font-size: 16px; margin-right: 6px; }
        .ll__search {
          flex: 1;
          border: none;
          background: none;
          padding: 9px 0;
          font-size: 13px;
          color: var(--text-primary);
        }
        .ll__clear {
          background: none;
          color: var(--text-muted);
          font-size: 11px;
          padding: 2px 4px;
        }
        .ll__clear:hover { color: var(--blue-500); }
        .ll__filter-select {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 9px 12px;
          font-size: 12px;
          font-family: var(--font-mono);
          color: var(--text-secondary);
          background: var(--white);
          cursor: pointer;
          letter-spacing: 0.04em;
        }
        .ll__filter-select:focus {
          border-color: var(--blue-400);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .ll__reset {
          padding: 9px 14px;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          color: var(--blue-600);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          border-radius: var(--radius);
          text-transform: uppercase;
        }
        .ll__reset:hover { background: var(--blue-100); }
        .ll__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .ll__grid > * { background: var(--white); }
        .ll__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          border: 1px dashed var(--border-strong);
          gap: 12px;
          color: var(--text-muted);
        }
        .ll__empty-icon {
          font-size: 48px;
          color: var(--blue-200);
          font-family: var(--font-mono);
        }
        .ll__empty-title {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-secondary);
        }
        .ll__empty-sub { font-size: 13px; color: var(--text-muted); }
        .ll__loader {
          width: 32px; height: 32px;
          border: 3px solid var(--blue-100);
          border-top-color: var(--blue-500);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};