# Vercel Deployment Guide for Fritim Backend

## 🚀 **Deployment Steps**

### 1. **Prepare Your Repository**
Make sure your backend code is in a separate Git repository (recommended) or a subdirectory of your main repo.

### 2. **Connect to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Next.js project

### 3. **Configure Environment Variables**
In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://lffrdsaxkcdiqdvajuhh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZnJkc2F4a2NkaXFkdmFqdWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODM1NTgsImV4cCI6MjA3NDU1OTU1OH0.fBaIZ8Dvs0r8h91fdZvZYpcQizzDeVTB4Y8g8tOe2Jk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZnJkc2F4a2NkaXFkdmFqdWhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4MzU1OCwiZXhwIjoyMDc0NTU5NTU4fQ.G0mwYZ_ZrWNz7-1o7yvZKwBb7cnqoZRbE-qWCzP0Fkg
JWT_SECRET=+WKS2cU5lWf+IQaSeeBIFwby/3QFx27UKjGPD9oBhC4qj1K+iISqfoB69zDlK7B0wy9N4EonIgKpJ7v0UIVYgw==
```

**Important:** Set these for all environments (Production, Preview, Development)

### 4. **Build Configuration**
Vercel will automatically detect the build settings:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 5. **Deploy**
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your backend will be available at `https://your-project-name.vercel.app`

## 🔧 **Fixed Issues**

### ✅ **Build Configuration**
- Fixed package.json dependencies with exact versions
- Added `vercel.json` configuration
- Updated Next.js config for production
- Removed empty directories that caused build failures

### ✅ **TypeScript Issues**
- Created proper type definitions in `src/lib/types.ts`
- Fixed import paths throughout the codebase
- Updated interfaces to include optional related data

### ✅ **Directory Structure**
- Removed empty API route directories
- Cleaned up unused files
- Organized types properly

## 📋 **Environment Variables Reference**

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for backend operations) | ✅ |
| `JWT_SECRET` | Secret for JWT token signing | ✅ |

## 🧪 **Testing Your Deployment**

After deployment, test these endpoints:

```bash
# Test clubs endpoint
curl https://your-project.vercel.app/api/clubs

# Test funds endpoint  
curl https://your-project.vercel.app/api/funds

# Test equipment endpoint
curl https://your-project.vercel.app/api/equipment
```

## 🔄 **Updating Your Mobile App**

Once deployed, update your mobile app's Supabase configuration to point to your Vercel backend:

```typescript
// In your mobile app's lib/supabase.ts
const supabaseUrl = 'https://your-project.vercel.app/api';
```

## 🚨 **Common Issues & Solutions**

### **Build Fails with "Missing Environment Variables"**
- Ensure all environment variables are set in Vercel dashboard
- Check that variable names match exactly (case-sensitive)

### **API Routes Return 500 Errors**
- Verify Supabase credentials are correct
- Check Vercel function logs for specific error messages

### **Database Connection Issues**
- Ensure your Supabase project is active
- Check that RLS policies allow anonymous access for public data

## 📱 **Next Steps**

1. **Deploy to Vercel** using the steps above
2. **Update mobile app** to use the new backend URL
3. **Test all functionality** with real data
4. **Set up custom domain** (optional)
5. **Configure monitoring** and error tracking (optional)

Your backend is now ready for production deployment! 🎉
