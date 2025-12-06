const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyHmac } = require('../utils/shopify');

// Simple header-based tenant identification: x-tenant-apikey
async function findTenant(req) {
  const apiKey = req.headers['x-tenant-apikey'] || req.query.apiKey;
  if (!apiKey) return null;
  return prisma.tenant.findUnique({ where: { apiKey } });
}

// Webhook receiver / generic ingest
router.post('/webhook/shopify', express.json({ limit: '1mb' }), async (req, res) => {
  try {
    const tenant = await findTenant(req);
    if (!tenant) return res.status(401).json({ error: 'missing tenant api key' });
    // optional webhook HMAC verification
    const header = req.headers['x-shopify-hmac-sha256'];
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const raw = JSON.stringify(req.body || {});
    if (secret && header) {
      const ok = verifyHmac(secret, raw, header);
      if (!ok) return res.status(401).json({ error: 'invalid hmac' });
    }

    const { topic, data } = req.body || {};
    if (!topic) return res.status(400).json({ error: 'topic required' });

    // handle customers, orders, products, custom events
    if (topic.startsWith('customers/')) {
      const customer = data;
      await prisma.customer.upsert({
        where: { shopifyId: String(customer.id) },
        update: {
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          tenantId: tenant.id
        },
        create: {
          shopifyId: String(customer.id),
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          tenantId: tenant.id
        }
      });
    }

    if (topic.startsWith('orders/')) {
      const order = data;
      // find customer by shopifyId if provided
      let customerId = null;
      if (order.customer?.id) {
        const customer = await prisma.customer.findUnique({ 
          where: { shopifyId: String(order.customer.id) } 
        });
        customerId = customer?.id || null;
      }
      
      await prisma.order.upsert({
        where: { shopifyId: String(order.id) },
        update: {
          totalPrice: parseFloat(order.total_price || 0),
          currency: order.currency || 'USD',
          createdAt: new Date(order.created_at),
          customerId: customerId,
          tenantId: tenant.id
        },
        create: {
          shopifyId: String(order.id),
          totalPrice: parseFloat(order.total_price || 0),
          currency: order.currency || 'USD',
          createdAt: new Date(order.created_at),
          customerId: customerId,
          tenantId: tenant.id
        }
      });
    }

    if (topic.startsWith('products/')) {
      const product = data;
      await prisma.product.upsert({
        where: { id: `${tenant.id}-${product.id}` },
        update: {
          title: product.title,
          sku: product.variants?.[0]?.sku || null,
          price: parseFloat(product.variants?.[0]?.price || 0)
        },
        create: {
          id: `${tenant.id}-${product.id}`,
          shopifyId: String(product.id),
          title: product.title,
          sku: product.variants?.[0]?.sku || null,
          price: parseFloat(product.variants?.[0]?.price || 0),
          tenantId: tenant.id
        }
      });
    }

    // generic event store
    if (topic.startsWith('events/')) {
      await prisma.event.create({
        data: {
          tenantId: tenant.id,
          type: topic,
          payload: JSON.stringify(req.body.data || {}),
        }
      });
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
