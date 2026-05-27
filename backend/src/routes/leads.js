const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  getStats,
  createLead,
  updateLeadStatus,
  updateLead,
  deleteLead,
} = require('../controllers/leadsController');

router.get('/stats', getStats);
router.get('/', getAllLeads);
router.post('/', createLead);
router.patch('/:id/status', updateLeadStatus);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
