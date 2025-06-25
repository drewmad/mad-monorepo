# Environment Setup for Authentication

## Required Environment Variables

To enable login and signup functionality, you need to create an `.env.local` file in the `apps/web` directory with the following variables:

```bash
# Supabase Configuration
# Get these values from your Supabase project dashboard at https://app.supabase.com

# Public URL - found in Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Anonymous Key - found in Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key - found in Settings > API (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URLs (from Settings > Database)
POSTGRES_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-database-password
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db.[project].supabase.co

# Additional Supabase Settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

## Setup Steps

1. **Create Supabase Project**: Go to [supabase.com](https://app.supabase.com) and create a new project

2. **Get API Keys**: 
   - Go to Settings > API
   - Copy the Project URL and anon/public key

3. **Get Database URL**:
   - Go to Settings > Database
   - Copy the connection string

4. **Create Environment File**:
   ```bash
   # In apps/web directory
   touch .env.local
   ```

5. **Add Variables**: Paste the configuration above with your actual values

6. **Restart Development Server**: 
   ```bash
   pnpm dev
   ```

## Troubleshooting

- Make sure `.env.local` is in the `apps/web` directory (not the root)
- Ensure all required variables are present
- Check that your Supabase project is active
- Verify your database connection string is correct 