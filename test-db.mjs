// Simple test script to check database connection
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test if tables exist
    const categoryCount = await prisma.category.count();
    console.log(`✅ Found ${categoryCount} categories in database`);
    
    // List all tables
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('✅ Available tables:', result);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
