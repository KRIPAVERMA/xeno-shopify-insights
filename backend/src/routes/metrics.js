const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

function apiKeyFromReq(req) {
  return req.headers['x-tenant-apikey'] || req.query.apiKey;
}

router.get('/', async (req, res) => {
  try {
    const apiKey = apiKeyFromReq(req);
    if (!apiKey) return res.status(401).json({ error: 'missing api key' });
    const tenant = await prisma.tenant.findUnique({ where: { apiKey } });
    if (!tenant) return res.status(404).json({ error: 'tenant not found' });

    // optional date range filtering
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const orderWhere = { tenantId: tenant.id };
    if (Object.keys(dateFilter).length > 0) {
      orderWhere.createdAt = dateFilter;
    }

    const totalCustomers = await prisma.customer.count({ where: { tenantId: tenant.id } });
    const totalOrders = await prisma.order.count({ where: orderWhere });
    const revenueAgg = await prisma.order.aggregate({
      where: orderWhere,
      _sum: { totalPrice: true }
    });
    const revenue = revenueAgg._sum.totalPrice || 0;

    // top 5 customers by spend
    const topCustomers = await prisma.$queryRaw`
      SELECT c.id, c.email, SUM(o.totalPrice) as spend
      FROM Customer c
      JOIN "Order" o ON o.customerId = c.id
      WHERE c.tenantId = ${tenant.id}
      GROUP BY c.id, c.email
      ORDER BY spend DESC
      LIMIT 5
    `;

    // orders by date (for charting)
    const ordersByDate = await prisma.order.groupBy({
      by: ['createdAt'],
      where: orderWhere,
      _count: { id: true },
      _sum: { totalPrice: true },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    res.json({ totalCustomers, totalOrders, revenue, topCustomers, ordersByDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
