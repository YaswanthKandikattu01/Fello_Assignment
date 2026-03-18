import express from 'express';
import { enrichFromVisitorSignals, enrichFromCompanyName, batchEnrich } from '../services/enrichment.js';

const router = express.Router();

router.post('/visitor', async (req, res) => {
  try {
    const {
      visitorId,
      ip,
      pagesVisited,
      timeOnSite,
      visitsThisWeek,
      referralSource,
      device,
      location,
      companyName,
      domain
    } = req.body;

    if (!ip && !companyName) {
      return res.status(400).json({
        error: 'Either IP address or company name is required'
      });
    }

    const result = await enrichFromVisitorSignals({
      visitorId,
      ip,
      pagesVisited: pagesVisited || [],
      timeOnSite: timeOnSite || 0,
      visitsThisWeek: visitsThisWeek || 1,
      referralSource: referralSource || '',
      device: device || '',
      location: location || '',
      companyName,
      domain
    });

    res.json(result);
  } catch (error) {
    console.error('Visitor analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze visitor data', details: error.message });
  }
});

router.post('/company', async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const result = await enrichFromCompanyName(companyName);
    res.json(result);
  } catch (error) {
    console.error('Company analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze company', details: error.message });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { companies } = req.body;

    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      return res.status(400).json({ error: 'Companies array is required' });
    }

    if (companies.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 companies per batch request' });
    }

    const result = await batchEnrich(companies);
    res.json(result);
  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ error: 'Failed to process batch', details: error.message });
  }
});

export default router;
