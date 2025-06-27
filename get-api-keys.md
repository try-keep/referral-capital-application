# How to Get API Keys for Compliance System

## 1. Supabase Service Role Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `gtogvkaukyxxwvxenfit`
3. Go to **Settings** → **API**
4. Copy the **service_role secret** key (NOT the anon key)
5. Add to `.env.local` as: `SUPABASE_SERVICE_ROLE_KEY=your_key_here`

## 2. NewsAPI Key (for Adverse Media Checks)

1. Go to: https://newsapi.org/
2. Click **Get API Key**
3. Sign up for free account
4. Copy your API key
5. Add to `.env.local` as: `NEWSAPI_KEY=your_key_here`

**Free Tier Limits**: 1,000 requests/month

## 3. OpenAI API Key (for AI Categorization)

1. Go to: https://openai.com/api/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)
6. Add to `.env.local` as: `OPENAI_API_KEY=your_key_here`

**Pricing**: ~$0.002 per categorization request

## 4. Complete .env.local File

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gtogvkaukyxxwvxenfit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2d2a2F1a3l4eHd2eGVuZml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTUxMDMsImV4cCI6MjA1NjA5MTEwM0.lkqLfgssE3jjaSjJG3vcJiPin9RMDsx-lelwKueROKE

# Service role key for database operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2d2a2F1a3l4eHd2eGVuZml0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDUxNTEwMywiZXhwIjoyMDU2MDkxMTAzfQ.YOUR_ACTUAL_KEY_HERE

# NewsAPI for adverse media monitoring
NEWSAPI_KEY=your_newsapi_key_here

# OpenAI for AI business categorization
OPENAI_API_KEY=sk-your_openai_key_here
```

## 5. After Adding Keys

1. **Restart the dev server**: `npm run dev`
2. **Test compliance**: Go to `/test-api` page
3. **Check database**: Look for entries in `compliance_checks` table
4. **Run full test**: `npm run test:compliance`

## 6. Verify Keys Are Working

Use the debug endpoint to check:

```bash
curl http://localhost:3009/api/debug
```

Should show all keys as `true`:

```json
{
  "env_check": {
    "supabase_url": true,
    "supabase_service_key": true,
    "openai_key": true,
    "newsapi_key": true
  }
}
```
