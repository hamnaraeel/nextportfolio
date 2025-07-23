-- Run this in project zzzckmigcqowpzpxgymn
-- Go to: https://supabase.com/dashboard/project/zzzckmigcqowpzpxgymn/sql/new

-- Drop existing tables if any
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

-- Success message
SELECT 'SUCCESS: Tables created in project zzzckmigcqowpzpxgymn!' as status;
