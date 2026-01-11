# 🔑 Getting Your Supabase Credentials

Your Supabase Project URL: `https://wzjkfkzwftzhxbxaalnh.supabase.co`

## Steps to Get Your API Keys

### 1. Go to Supabase Dashboard

- Open: https://app.supabase.com
- Sign in with your account
- Select your project (should appear in the list)

### 2. Navigate to Project Settings

- Click **⚙️ Settings** (bottom left) → **API**

### 3. Copy Your Keys

You'll see different API keys on this page. Copy these:

| Key Name                    | Where to Find            | Paste In .env As                                        |
| --------------------------- | ------------------------ | ------------------------------------------------------- |
| **Project URL**             | At top of API page       | `SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_URL`           |
| **anon public** key         | Under "Project API keys" | `SUPABASE_ANON_KEY` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role secret** key | Under "Project API keys" | `SUPABASE_SERVICE_KEY`                                  |

### 4. Your .env File Should Look Like This

```env
EXPO_PUBLIC_SUPABASE_URL=https://wzjkfkzwftzhxbxaalnh.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

SUPABASE_URL=https://wzjkfkzwftzhxbxaalnh.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

PORT=3000
CORS_ORIGIN=http://localhost:3000,exp://localhost:8081
```

## ⚠️ Important Notes

1. **Don't share service_role key** - Keep it secret, only for backend
2. **Anon key is public** - It's safe to use in frontend
3. **Never commit .env** - It's already in .gitignore
4. **Keys have 3 parts** - Make sure you copy the entire string

## Next Steps

1. Copy the 3 keys from Supabase
2. Create `.env` file from `.env.example`
3. Paste the keys into `.env`
4. Proceed to create database tables (see SUPABASE_SETUP_CHECKLIST.md)

---

Need help? Check the Supabase docs: https://supabase.com/docs/guides/api
