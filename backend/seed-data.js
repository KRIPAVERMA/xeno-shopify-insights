// Seed demo data for testing the dashboard
const prisma = require('./src/prismaClient');

async function seed() {
  try {
    console.log('🌱 Starting data seeding...\n');

    // Get the existing tenant (Demo Store)
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.error('❌ No tenant found. Please register first.');
      return;
    }
    console.log(`✅ Found tenant: ${tenant.name} (ID: ${tenant.id})\n`);

    // Create 5 customers
    console.log('📝 Creating customers...');
    const customers = [];
    const customerData = [
      { email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', shopifyId: 'cust_001' },
      { email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', shopifyId: 'cust_002' },
      { email: 'bob.johnson@example.com', firstName: 'Bob', lastName: 'Johnson', shopifyId: 'cust_003' },
      { email: 'alice.williams@example.com', firstName: 'Alice', lastName: 'Williams', shopifyId: 'cust_004' },
      { email: 'charlie.brown@example.com', firstName: 'Charlie', lastName: 'Brown', shopifyId: 'cust_005' },
    ];

    for (const data of customerData) {
      const customer = await prisma.customer.create({
        data: { ...data, tenantId: tenant.id }
      });
      customers.push(customer);
      console.log(`  ✓ Created: ${data.firstName} ${data.lastName}`);
    }

    // Create 5 products
    console.log('\n📦 Creating products...');
    const products = [];
    const productData = [
      { title: 'Premium Laptop', sku: 'LAPTOP-001', price: 1299.99, shopifyId: 'prod_001' },
      { title: 'Wireless Mouse', sku: 'MOUSE-001', price: 49.99, shopifyId: 'prod_002' },
      { title: 'Mechanical Keyboard', sku: 'KEYB-001', price: 149.99, shopifyId: 'prod_003' },
      { title: 'USB-C Hub', sku: 'HUB-001', price: 79.99, shopifyId: 'prod_004' },
      { title: 'Monitor Stand', sku: 'STAND-001', price: 89.99, shopifyId: 'prod_005' },
    ];

    for (const data of productData) {
      const product = await prisma.product.create({
        data: { ...data, tenantId: tenant.id }
      });
      products.push(product);
      console.log(`  ✓ Created: ${data.title} ($${data.price})`);
    }

    // Create 10 orders with varying amounts
    console.log('\n💰 Creating orders...');
    const orderData = [
      { customerId: customers[0].id, totalPrice: 1299.99, currency: 'USD', shopifyId: 'order_001' },
      { customerId: customers[0].id, totalPrice: 149.99, currency: 'USD', shopifyId: 'order_002' },
      { customerId: customers[1].id, totalPrice: 899.97, currency: 'USD', shopifyId: 'order_003' },
      { customerId: customers[1].id, totalPrice: 49.99, currency: 'USD', shopifyId: 'order_004' },
      { customerId: customers[2].id, totalPrice: 229.98, currency: 'USD', shopifyId: 'order_005' },
      { customerId: customers[3].id, totalPrice: 1379.98, currency: 'USD', shopifyId: 'order_006' },
      { customerId: customers[3].id, totalPrice: 79.99, currency: 'USD', shopifyId: 'order_007' },
      { customerId: customers[4].id, totalPrice: 89.99, currency: 'USD', shopifyId: 'order_008' },
      { customerId: customers[4].id, totalPrice: 199.98, currency: 'USD', shopifyId: 'order_009' },
      { customerId: customers[2].id, totalPrice: 549.99, currency: 'USD', shopifyId: 'order_010' },
    ];

    let totalRevenue = 0;
    for (const data of orderData) {
      const customer = customers.find(c => c.id === data.customerId);
      const order = await prisma.order.create({
        data: {
          ...data,
          tenantId: tenant.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
        }
      });
      totalRevenue += data.totalPrice;
      console.log(`  ✓ Order ${order.shopifyId}: $${data.totalPrice} (${customer.firstName} ${customer.lastName})`);
    }

    // Create some custom events
    console.log('\n📊 Creating custom events...');
    const events = [
      { type: 'page_view', payload: JSON.stringify({ page: '/products', visitor: 'anonymous' }) },
      { type: 'cart_abandoned', payload: JSON.stringify({ items: 3, value: 299.97 }) },
      { type: 'newsletter_signup', payload: JSON.stringify({ email: 'newuser@example.com' }) },
    ];

    for (const data of events) {
      await prisma.event.create({
        data: { ...data, tenantId: tenant.id }
      });
      console.log(`  ✓ Event: ${data.type}`);
    }

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Tenant: ${tenant.name}`);
    console.log(`   • Customers: ${customers.length}`);
    console.log(`   • Products: ${products.length}`);
    console.log(`   • Orders: ${orderData.length}`);
    console.log(`   • Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`   • Events: ${events.length}`);
    console.log('\n🎉 Refresh your dashboard to see the data!\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
