# Supabase Setup Guide

This guide will help you set up Supabase for the Fritim app backend and mobile app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `fritim-app`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

### Backend Environment Variables

Create a `.env.local` file in the backend directory (`/Users/jornlarsen/Desktop/Fritim-Backend/`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret (for custom auth if needed)
JWT_SECRET=your_jwt_secret_here
```

### Mobile App Configuration

Update the Supabase configuration in `/Users/jornlarsen/Desktop/Fritim/App/lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your_anon_key_here';
```

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

## 5. Seed the Database

1. In the SQL Editor, copy the contents of `supabase/seed.sql`
2. Paste it into the SQL Editor
3. Click "Run" to populate the database with sample data

## 6. Set Up Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Go to **Authentication** → **Users** to manage users

## 7. Create Initial Users

You can create users through the Supabase dashboard or via the API. For testing, you can create users manually:

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Create users with these roles:
   - Admin user: `admin@fritim.no`
   - Club admin: `club@fritim.no`
   - Regular user: `user@fritim.no`

## 8. Test the Connection

### Backend Testing

1. Install dependencies:
   ```bash
   cd /Users/jornlarsen/Desktop/Fritim-Backend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Test the API endpoints:
   - `GET http://localhost:3000/api/clubs` - Should return clubs
   - `GET http://localhost:3000/api/events` - Should return events
   - `GET http://localhost:3000/api/users` - Should return users

### Mobile App Testing

1. Install dependencies:
   ```bash
   cd /Users/jornlarsen/Desktop/Fritim/App
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

## 9. Row Level Security (RLS)

The database schema includes Row Level Security policies that ensure:

- Users can only see their own data where appropriate
- Club admins can manage their club's data
- Admins have full access
- Public data (clubs, events, equipment) is viewable by everyone

## 10. Production Considerations

Before deploying to production:

1. **Environment Variables**: Use proper environment variable management
2. **Database Backups**: Set up automated backups in Supabase
3. **Monitoring**: Enable Supabase monitoring and alerts
4. **Security**: Review and test all RLS policies
5. **Performance**: Monitor query performance and optimize as needed

## Troubleshooting

### Common Issues

1. **Connection Errors**: Verify your environment variables are correct
2. **RLS Errors**: Check that your policies are properly configured
3. **Authentication Issues**: Ensure users are created in Supabase Auth
4. **CORS Issues**: Configure allowed origins in Supabase settings

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com)

## Database Schema Overview

The database includes the following main tables:

- **clubs**: Sports clubs information
- **profiles**: User profiles (extends Supabase auth.users)
- **events**: Dugnad events
- **event_responses**: User responses to events
- **equipment_listings**: Marketplace equipment
- **funds**: Club funds
- **fund_transactions**: Fund transaction history
- **frikjop_transactions**: Frikjøp purchase history

All tables include proper relationships, indexes, and RLS policies for security.
