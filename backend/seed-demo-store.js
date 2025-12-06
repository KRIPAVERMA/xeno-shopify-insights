// Add data to the Demo Store tenant (the one you registered with)
const prisma = require('./src/prismaClient');

async function seedDemoStore() {
  try {
    // Find the Demo Store tenant (the one you registered with)
    const tenant = await prisma.tenant.findUnique({
      where: { apiKey: '2e20ac3e-79ee-4d10-b6dd-8ed13c01e1ae' }
    });
    
    if (!tenant) {
      console.error('❌ Demo Store tenant not found');
      return;
    }

    console.log(`✅ Found tenant: ${tenant.name}\n`);
    console.log('📝 Adding customers...');
    
    const customers = [];
    for (let i = 1; i <= 5; i++) {
      const c = await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          shopifyId: `demo_cust_${i}`,
          email: `customer${i}@demo.com`,
          firstName: `Customer`,
          lastName: `${i}`
        }
      });
      customers.push(c);
      console.log(`  ✓ customer${i}@demo.com`);
    }

    console.log('\n💰 Adding orders...');
    let totalRevenue = 0;
    for (let i = 0; i < 10; i++) {
      const price = Math.floor(Math.random() * 900) + 100;
      totalRevenue += price;
      await prisma.order.create({
        data: {
          tenantId: tenant.id,
          customerId: customers[i % 5].id,
          shopifyId: `demo_order_${i}`,
          totalPrice: price,
          currency: 'USD',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      });
      console.log(`  ✓ Order ${i + 1}: $${price}`);
    }

    console.log(`\n✅ Done! Total Revenue: $${totalRevenue}`);
    console.log('\n🔄 Now refresh your dashboard!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoStore();
