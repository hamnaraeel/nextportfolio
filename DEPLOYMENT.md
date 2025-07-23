# Deployment Guide with Supabase

## Prerequisites

1. ✅ Supabase project created and configured
2. ✅ Environment variables updated in `.env`
3. ✅ Database schema pushed to Supabase
4. ✅ Database seeded with initial data

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   
2. **Environment Variables**:
   Add these in your Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   NEXTAUTH_SECRET=your-production-secret-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   UPLOAD_DIR=./public/uploads
   MAX_FILE_SIZE=10485760
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=admin123
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically run the build process
   - Your site will be live at `https://your-project.vercel.app`

### Netlify

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository
   
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   
3. **Environment Variables**:
   Add the same environment variables as listed above in Netlify's site settings.

## Post-Deployment Checklist

- [ ] Site loads successfully
- [ ] Admin dashboard accessible at `/admin`
- [ ] Database connection working
- [ ] File uploads working (if using local storage)
- [ ] Authentication working
- [ ] All pages rendering correctly

## Benefits of This Setup

✅ **Zero Server Management**: Supabase handles all database operations  
✅ **Global CDN**: Your site loads fast worldwide  
✅ **Automatic Scaling**: Handles traffic spikes automatically  
✅ **HTTPS Included**: Secure by default  
✅ **Easy Updates**: Push to GitHub = automatic deployment  

## Monitoring & Maintenance

- **Supabase Dashboard**: Monitor database usage and performance
- **Vercel Analytics**: Track site performance and visitor data
- **Error Monitoring**: Check deployment logs for any issues

## Cost Considerations

- **Supabase**: Generous free tier (500MB database, 50,000 monthly active users)
- **Vercel**: Free tier includes 100GB bandwidth, perfect for portfolios
- **Total Cost**: $0 for most portfolio use cases! 🎉
