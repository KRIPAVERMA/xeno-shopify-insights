// Test script to debug server startup
const prisma = require('./src/prismaClient');

async function test() {
  try {
    console.log('Testing database connection...');
    const tenants = await prisma.tenant.findMany();
    console.log('✓ Database connected. Tenants:', tenants.length);
    
    console.log('\nTesting tenant creation...');
    const { v4: uuidv4 } = require('uuid');
    const testTenant = await prisma.tenant.create({
      data: {
        name: 'Test Store',
        shopifyShop: 'test.myshopify.com',
        apiKey: uuidv4()
      }
    });
    console.log('✓ Tenant created:', testTenant);
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
