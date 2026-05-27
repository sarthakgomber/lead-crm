const { pool } = require('../db');

// GET /api/leads
const getAllLeads = async (req, res) => {
  try {
    const { search, status, source } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR phone ILIKE $${params.length})`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (source) {
      params.push(source);
      query += ` AND source = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/leads/stats
const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Interested') AS interested,
        COUNT(*) FILTER (WHERE status = 'Not Interested') AS not_interested,
        COUNT(*) FILTER (WHERE status = 'Converted') AS converted,
        COUNT(*) FILTER (WHERE source = 'Call') AS from_call,
        COUNT(*) FILTER (WHERE source = 'WhatsApp') AS from_whatsapp,
        COUNT(*) FILTER (WHERE source = 'Field') AS from_field
      FROM leads
    `);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/leads
const createLead = async (req, res) => {
  try {
    const { name, phone, source, notes } = req.body;

    if (!name || !phone || !source) {
      return res.status(400).json({ success: false, message: 'Name, phone, and source are required' });
    }
    if (!['Call', 'WhatsApp', 'Field'].includes(source)) {
      return res.status(400).json({ success: false, message: 'Source must be Call, WhatsApp, or Field' });
    }
    if (!/^\+?[\d\s\-()]{7,20}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    const result = await pool.query(
      'INSERT INTO leads (name, phone, source, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.trim(), phone.trim(), source, notes?.trim() || null]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Lead created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/leads/:id/status
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Interested', 'Not Interested', 'Converted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const result = await pool.query(
      'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/leads/:id
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, source, notes, status } = req.body;

    const result = await pool.query(
      `UPDATE leads SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        source = COALESCE($3, source),
        notes = COALESCE($4, notes),
        status = COALESCE($5, status)
       WHERE id = $6 RETURNING *`,
      [name, phone, source, notes, status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Lead updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllLeads, getStats, createLead, updateLeadStatus, updateLead, deleteLead };
