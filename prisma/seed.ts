import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default categories
  const webDevCategory = await prisma.category.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: {
      name: 'Web Development',
      description: 'Full-stack web applications and websites',
      color: '#3B82F6'
    }
  });

  const mobileCategory = await prisma.category.upsert({
    where: { name: 'Mobile Apps' },
    update: {},
    create: {
      name: 'Mobile Apps',
      description: 'Mobile applications for iOS and Android',
      color: '#10B981'
    }
  });

  const designCategory = await prisma.category.upsert({
    where: { name: 'UI/UX Design' },
    update: {},
    create: {
      name: 'UI/UX Design',
      description: 'User interface and experience design projects',
      color: '#F59E0B'
    }
  });

  const dataCategory = await prisma.category.upsert({
    where: { name: 'Data Science' },
    update: {},
    create: {
      name: 'Data Science',
      description: 'Data analysis and machine learning projects',
      color: '#8B5CF6'
    }
  });

  // Create sample projects
  const sampleProject1 = await prisma.project.upsert({
    where: { id: 'sample-ecommerce-project' },
    update: {},
    create: {
      id: 'sample-ecommerce-project',
      title: 'E-commerce Platform',
      description: 'A modern e-commerce platform built with Next.js and Stripe integration',
      content: `
        <h2>Project Overview</h2>
        <p>This is a full-featured e-commerce platform that includes:</p>
        <ul>
          <li>Product catalog with search and filtering</li>
          <li>Shopping cart and checkout process</li>
          <li>User authentication and profiles</li>
          <li>Admin dashboard for inventory management</li>
          <li>Payment processing with Stripe</li>
          <li>Order tracking and history</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>Built using modern web technologies with a focus on performance and user experience.</p>
      `,
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Stripe'],
      liveUrl: 'https://example-ecommerce.vercel.app',
      githubUrl: 'https://github.com/username/ecommerce-platform',
      categoryId: webDevCategory.id,
      featured: true,
      published: true
    }
  });

  const sampleProject2 = await prisma.project.upsert({
    where: { id: 'sample-task-manager' },
    update: {},
    create: {
      id: 'sample-task-manager',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates',
      content: `
        <h2>Features</h2>
        <p>This task management app includes:</p>
        <ul>
          <li>Real-time collaboration</li>
          <li>Project boards and lists</li>
          <li>Due dates and notifications</li>
          <li>File attachments</li>
          <li>Team member assignment</li>
        </ul>
      `,
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
      liveUrl: 'https://example-tasks.herokuapp.com',
      githubUrl: 'https://github.com/username/task-manager',
      categoryId: webDevCategory.id,
      featured: true,
      published: true
    }
  });

  const sampleProject3 = await prisma.project.upsert({
    where: { id: 'sample-weather-app' },
    update: {},
    create: {
      id: 'sample-weather-app',
      title: 'Weather Mobile App',
      description: 'A cross-platform weather application with location-based forecasts',
      content: `
        <h2>App Features</h2>
        <p>Weather app with comprehensive forecasting:</p>
        <ul>
          <li>Current weather conditions</li>
          <li>7-day forecast</li>
          <li>Location-based weather</li>
          <li>Weather alerts and notifications</li>
          <li>Interactive weather maps</li>
        </ul>
      `,
      technologies: ['React Native', 'TypeScript', 'Redux', 'OpenWeather API'],
      liveUrl: null,
      githubUrl: 'https://github.com/username/weather-app',
      categoryId: mobileCategory.id,
      featured: false,
      published: true
    }
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@portfolio.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
