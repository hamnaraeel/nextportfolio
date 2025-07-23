# Portfolio Website

A comprehensive portfolio website built with Next.js 15, featuring project management, categories, media uploads, and an admin dashboard. Now powered by Supabase for easy deployment and scaling!

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📁 Project portfolio with categories and detailed views
- 🖼️ Image and video support for projects
- 🏷️ Category management with color coding
- 📊 Admin dashboard with vertical navigation
- 🔍 Project filtering and search
- 📱 Mobile-friendly responsive design
- ⚡ Fast loading with Next.js App Router
- 🗄️ Supabase PostgreSQL database with Prisma ORM
- 🚀 Ready for deployment on Vercel/Netlify

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **File Upload**: Multer + Sharp (for image processing)
- **Authentication**: NextAuth.js (ready for implementation)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone and setup**:
   ```bash
   cd portfolio
   npm install
   ```

2. **Supabase Setup**:
   - Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
   - Create a Supabase project
   - Get your project credentials
   
3. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
   ```

4. **Database Setup**:
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Push schema to Supabase
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your portfolio!

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── projects/       # Project pages
│   │   └── globals.css     # Global styles
│   └── lib/
│       └── prisma.ts       # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
└── public/                 # Static assets
```

## Usage

### Admin Dashboard

Visit `/admin` to access the admin dashboard where you can:

- **Overview**: View statistics and recent projects
- **Projects**: Create, edit, and manage your projects
- **Categories**: Organize projects into categories
- **Media**: Upload images and videos (planned feature)
- **Settings**: Configure site settings

### Adding Projects

1. Go to `/admin`
2. Click on "Projects" in the sidebar
3. Click "Add Project"
4. Fill in project details:
   - Title and description
   - Select a category
   - Add technologies (comma-separated)
   - Add live URL and GitHub URL
   - Mark as featured/published

### Managing Categories

1. Go to `/admin`
2. Click on "Categories" in the sidebar
3. Click "Add Category"
4. Set name, description, and color

## Database Schema

The application uses the following main models:

- **Project**: Contains project details, links, and metadata
- **Category**: Project categories with colors
- **ProjectMedia**: Images and videos for projects
- **User**: Admin users (for future authentication)

## Customization

### Styling

The project uses Tailwind CSS. You can customize:

- Colors in `tailwind.config.js`
- Global styles in `src/app/globals.css`
- Component styles inline with Tailwind classes

### Content

- Update the hero section in `src/app/page.tsx`
- Modify navigation in layout components
- Customize the admin dashboard in `src/app/admin/page.tsx`

## Deployment

### Quick Setup with Supabase + Vercel

For the easiest deployment experience, see the detailed guide in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

**Quick Steps:**
1. ✅ Supabase project configured
2. 📝 Push your code to GitHub  
3. 🔗 Connect your repo to Vercel
4. ⚙️ Set environment variables in Vercel dashboard
5. 🚀 Deploy!

### Supported Platforms

The app works with any platform supporting Node.js:

- **Vercel** (Recommended) - Zero config deployment
- **Netlify** - Great for static sites
- **Railway** - Simple database included
- **Heroku** - Classic platform
- **DigitalOcean App Platform** - Full-stack hosting
- **AWS Amplify** - AWS ecosystem

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own portfolio!

## Support

If you encounter any issues or have questions, please check the documentation or create an issue on GitHub.
