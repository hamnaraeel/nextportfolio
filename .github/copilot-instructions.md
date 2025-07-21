# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js portfolio website with the following architecture:
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, App Router
- **Backend**: Next.js API routes with REST endpoints
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js for admin access
- **File Upload**: Multer and Sharp for image/video processing
- **UI Components**: Lucide React for icons

## Key Features
- Project portfolio with categories and detailed views
- Admin dashboard with vertical navigation tabs
- File upload system for project images and videos
- Project listing with thumbnails and filtering
- Detailed project pages with multiple media assets
- Category management system

## Code Style Guidelines
- Use TypeScript for all files
- Use Tailwind CSS for styling
- Follow Next.js App Router conventions
- Use Prisma for database operations
- Implement proper error handling and validation
- Use server actions for form submissions
- Implement responsive design patterns

## Database Schema
- Projects: id, title, description, category, images, videos, technologies, live_url, github_url, created_at
- Categories: id, name, description, color
- Project_Media: id, project_id, type (image/video), url, alt_text, order

## API Structure
- `/api/projects` - CRUD operations for projects
- `/api/categories` - Category management
- `/api/upload` - File upload endpoints
- `/api/auth` - Authentication endpoints
