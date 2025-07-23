# Database Troubleshooting Guide

## Current Status
- ❌ Prisma Studio failing with complex error
- ❌ Database connection timing out
- ❌ Categories cannot be created

## Root Cause
The database tables don't exist in your Supabase project yet.

## SOLUTION: Create Tables Manually in Supabase

### Step 1: Go to Supabase SQL Editor
Visit: https://supabase.com/dashboard/project/ztctavajuhnjeyozmjrx/sql/new

### Step 2: Run This SQL Script
```sql
-- Drop existing tables (if any)
DROP TABLE IF EXISTS "project_media" CASCADE;
DROP TABLE IF EXISTS "projects" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TYPE IF EXISTS "MediaType" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Create enum types
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'THUMBNAIL');
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- Create categories table
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3B82F6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Create projects table
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "technologies" TEXT[],
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- Create project_media table
CREATE TABLE "project_media" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_media_pkey" PRIMARY KEY ("id")
);

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Add foreign keys
ALTER TABLE "projects" ADD CONSTRAINT "projects_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_projectId_fkey" 
    FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ID generation function
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS TEXT AS $$
BEGIN
    RETURN 'c' || replace(encode(gen_random_bytes(12), 'base64'), '/', '_');
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO "categories" ("id", "name", "description", "color") VALUES
(generate_cuid(), 'Web Development', 'Full-stack web applications', '#3B82F6'),
(generate_cuid(), 'Mobile Apps', 'iOS and Android applications', '#10B981'),
(generate_cuid(), 'UI/UX Design', 'User interface design projects', '#F59E0B'),
(generate_cuid(), 'Data Science', 'Analytics and machine learning', '#EF4444');

-- Insert admin user
INSERT INTO "users" ("id", "email", "password", "role") VALUES
(generate_cuid(), 'admin@portfolio.com', '$2b$10$rHKGHyNkDwMGZoFGc4g0deLK9FqP5o0Xo5l4J8vKZjCrJ0vN7X6MG', 'ADMIN');

-- Verification
SELECT 'SUCCESS: All tables created!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```

### Step 3: After Running SQL
You should see:
- "SUCCESS: All tables created!"
- List of tables: categories, project_media, projects, users

### Step 4: Test Your App
After creating tables:
1. Stop all running processes
2. Restart your dev server: `npm run dev`
3. Go to http://localhost:3000/admin
4. Try creating a category - it should work!

## Why This Happened
- `npx prisma db push` failed silently
- Supabase connection was working but tables didn't exist
- This is common when setting up Supabase for the first time

## After Tables Are Created
Once tables exist, you can use:
- `npx prisma studio` - Should work perfectly
- `npx prisma db push` - For future schema changes
- Your admin dashboard - Full functionality

## Next Steps
1. Run the SQL script above
2. Restart your development server
3. Test creating categories
4. Report back if you see any other issues
