# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `portfolio-database` (or any name you prefer)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest to your location
6. Click "Create new project"

## Step 2: Get Your Project Credentials

Once your project is created:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Project API Key (anon public)**: `eyJ...` (starts with eyJ)

3. Go to **Settings** > **Database**
4. Copy the **Connection string** > **URI**:
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres`

## Step 3: Update Your Environment Variables

Update your `.env` file with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Direct connection for migrations (without pgbouncer)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` and `[PROJECT-REF]` with your actual values!

## Step 4: Run Database Migrations

After updating your `.env` file, run these commands:

```bash
# Generate Prisma client
npm run prisma generate

# Push your schema to Supabase
npx prisma db push

# Seed your database with initial data
npm run db:seed
```

## Step 5: Verify Setup

1. Go to your Supabase project dashboard
2. Click on **Table Editor**
3. You should see your tables: `categories`, `projects`, `project_media`, `users`

## Benefits of Using Supabase

✅ **Hosted Database**: No need to manage your own PostgreSQL server  
✅ **Auto-scaling**: Handles traffic spikes automatically  
✅ **Built-in Authentication**: Can replace NextAuth.js if needed  
✅ **Real-time Features**: Built-in real-time subscriptions  
✅ **Easy Deployment**: Works seamlessly with Vercel, Netlify, etc.  
✅ **Generous Free Tier**: Perfect for portfolio projects  

## Deployment Notes

When deploying to Vercel/Netlify:
1. Add all environment variables to your deployment platform
2. The `NEXT_PUBLIC_*` variables will be available on the client-side
3. The database URLs will be used server-side only

## Troubleshooting

- **Connection errors**: Double-check your DATABASE_URL and password
- **Migration errors**: Ensure DIRECT_URL is set correctly
- **Missing tables**: Run `npx prisma db push` again
- **Seed errors**: Make sure tables exist before running seed command
