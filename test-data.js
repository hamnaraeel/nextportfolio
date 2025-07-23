// Test script to verify database data
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testData() {
  try {
    console.log('🔍 Testing database connection and data...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`📁 Found ${categories.length} categories:`);
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.color})`));
    
    // Check projects
    const projects = await prisma.project.findMany({
      include: { category: true, media: true }
    });
    console.log(`📄 Found ${projects.length} projects:`);
    projects.forEach(proj => console.log(`  - ${proj.title} (${proj.category.name})`));
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`👤 Found ${users.length} users:`);
    users.forEach(user => console.log(`  - ${user.email} (${user.role})`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testData();
