import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test reading categories
    const categories = await prisma.category.findMany();
    console.log('✅ Found categories:', categories.length);
    
    // Test creating a test category
    const testCategory = await prisma.category.create({
      data: {
        name: `Test Category ${Date.now()}`,
        description: 'Test description',
        color: '#FF0000'
      }
    });
    console.log('✅ Created test category:', testCategory.id);
    
    // Clean up test category
    await prisma.category.delete({
      where: { id: testCategory.id }
    });
    console.log('✅ Cleaned up test category');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection and operations working',
      categoriesCount: categories.length 
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
