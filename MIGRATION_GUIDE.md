# Migration Guide - Extended Appearance Update

If you're getting 500 errors after pulling the latest changes, follow these steps:

## Step 1: Stop All Servers
```bash
# Press Ctrl+C in all terminal windows running dev servers
# Or use:
pkill -f "ts-node-dev"
pkill -f "vite"
```

## Step 2: Update Prisma and Database
```bash
cd backend

# Regenerate Prisma Client (CRITICAL!)
npx prisma generate

# Push schema changes to database
npx prisma db push

# If db push fails, you may need to reset the database (WARNING: loses data)
# npx prisma migrate reset --skip-seed
```

## Step 3: Verify Database Schema
```bash
# Check if new columns exist
npx prisma studio

# Open PlatformSettings model and verify these fields exist:
# - secondaryColor
# - accentColor
# - fontFamily
# - fontSize
# - borderRadius
# - darkModeDefault
```

## Step 4: If Database is Corrupted - Manual Fix
If `npx prisma db push` fails, manually add the columns:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database_name

# Run these SQL commands:
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS "secondaryColor" TEXT NOT NULL DEFAULT '#10b981';
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS "accentColor" TEXT NOT NULL DEFAULT '#f59e0b';
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS "fontFamily" TEXT NOT NULL DEFAULT 'Inter';
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS "fontSize" TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS "borderRadius" TEXT NOT NULL DEFAULT 'medium';
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS "darkModeDefault" BOOLEAN NOT NULL DEFAULT false;

# Exit psql
\q
```

## Step 5: Restart Servers
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## Step 6: Test Endpoints
```bash
# Test public settings endpoint
curl http://localhost:3000/api/settings/public

# Should return JSON with all the new fields:
# secondaryColor, accentColor, fontFamily, fontSize, borderRadius, darkModeDefault
```

## Common Issues

### Issue: "Unknown field" error from Prisma
**Solution:** Run `npx prisma generate` again

### Issue: Database columns don't exist
**Solution:** Run `npx prisma db push` or use the manual SQL commands above

### Issue: Still getting 500 errors
**Solution:**
1. Check backend console logs for the actual error
2. Make sure DATABASE_URL in `.env` is correct
3. Try restarting PostgreSQL service: `sudo systemctl restart postgresql`

### Issue: Frontend shows "Failed to fetch platform settings"
**Solution:**
1. Make sure backend is running on port 3000
2. Check browser console for CORS errors
3. Clear browser cache and localStorage

## Verify Everything Works
After completing all steps, you should be able to:
- Login successfully
- Navigate to Admin Settings → Appearance
- See new controls for secondary color, accent color, font family, etc.
- Change appearance settings and see them applied instantly
