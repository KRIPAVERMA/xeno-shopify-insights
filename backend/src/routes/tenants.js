const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { v4: uuidv4 } = require('uuid');

// Create tenant (simple onboarding)
router.post('/', async (req, res) => {
  try {
    const { name, shopifyShop } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const apiKey = uuidv4();
    const tenant = await prisma.tenant.create({
      data: { name, shopifyShop, apiKey }
    });
    res.json({ tenantId: tenant.id, apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
