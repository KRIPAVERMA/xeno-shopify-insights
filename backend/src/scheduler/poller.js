require('dotenv').config();
const prisma = require('../prismaClient');

async function poll() {
  console.log('Scheduler: polling tenants for demo sync...');
  const tenants = await prisma.tenant.findMany();
  for (const t of tenants) {
    // Demo: create a synthetic event to show activity
    await prisma.event.create({ 
      data: { 
        tenantId: t.id, 
        type: 'scheduler/demo_poll', 
        payload: JSON.stringify({ note: 'demo poll', timestamp: new Date().toISOString() })
      } 
    });
    console.log(`Created demo event for tenant ${t.name}`);
  }
}

async function run() {
  await poll();
  // run every 5 minutes
  setInterval(poll, 5 * 60 * 1000);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
