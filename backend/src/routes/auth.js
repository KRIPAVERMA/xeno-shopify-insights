const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-for-prod';

// Register a user for a tenant using tenant apiKey
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, apiKey } = req.body;
    if (!email || !password || !apiKey) return res.status(400).json({ error: 'email, password, apiKey required' });
    const tenant = await prisma.tenant.findUnique({ where: { apiKey } });
    if (!tenant) return res.status(404).json({ error: 'tenant not found' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name, tenantId: tenant.id } });

    const token = jwt.sign({ userId: user.id, tenantId: tenant.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, apiKey } = req.body;
    if (!email || !password || !apiKey) return res.status(400).json({ error: 'email, password, apiKey required' });
    const tenant = await prisma.tenant.findUnique({ where: { apiKey } });
    if (!tenant) return res.status(404).json({ error: 'tenant not found' });

    const user = await prisma.user.findFirst({ where: { tenantId: tenant.id, email } });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign({ userId: user.id, tenantId: tenant.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, apiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get current user (requires Authorization: Bearer <token>)
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'missing auth' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json({ id: user.id, email: user.email, name: user.name, tenantId: user.tenantId });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'invalid token' });
  }
});

module.exports = router;
