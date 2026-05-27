import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../api/leads';

export const useLeads = (filters = {}) => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [leadsRes, statsRes] = await Promise.all([
        leadsApi.getAll(filters),
        leadsApi.getStats(),
      ]);
      setLeads(leadsRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const addLead = async (data) => {
    const res = await leadsApi.create(data);
    await fetchLeads();
    return res.data.data;
  };

  const updateStatus = async (id, status) => {
    await leadsApi.updateStatus(id, status);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    const statsRes = await leadsApi.getStats();
    setStats(statsRes.data.data);
  };

  const deleteLead = async (id) => {
    await leadsApi.delete(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    const statsRes = await leadsApi.getStats();
    setStats(statsRes.data.data);
  };

  return { leads, stats, loading, error, addLead, updateStatus, deleteLead, refetch: fetchLeads };
};
