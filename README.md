# Portfolio Website

A comprehensive portfolio website built with Next.js 15, featuring project management, categories, media uploads, and an admin dashboard.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📁 Project portfolio with categories and detailed views
- 🖼️ Image and video support for projects
- 🏷️ Category management with color coding
- 📊 Admin dashboard with vertical navigation
- 🔍 Project filtering and search
- 📱 Mobile-friendly responsive design
- ⚡ Fast loading with Next.js App Router
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
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

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database connection and other settings:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Database Setup**:
   ```bash
   # Create and run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Start Development Server**:
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

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works with any platform supporting Node.js:

- Railway
- Heroku
- DigitalOcean App Platform
- AWS Amplify

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
