# Database Migration Guide

## Important: Switch from `db push` to `migrate dev`

Previously, this project used `prisma db push` for database schema changes. This approach is not suitable for production deployments.

### Why Migrations Matter

- **Version Control**: Track all schema changes over time
- **Production Safety**: Apply schema changes reliably in production
- **Team Collaboration**: Ensure everyone has the same database state
- **Rollback Capability**: Revert changes if needed

## Setting Up Migrations (One-Time)

If you're currently using `db push` and want to switch to migrations:

### Step 1: Create Initial Migration

Run this command in your terminal (requires user input):

```bash
cd backend
npx prisma migrate dev --name initial_migration
```

This will:
- Create a `prisma/migrations` directory
- Generate an initial migration from your current schema
- Apply the migration to your development database

### Step 2: Update Your Workflow

**Before (❌ Don't do this):**
```bash
npx prisma db push
```

**After (✅ Do this):**
```bash
npx prisma migrate dev --name descriptive_name
```

## Common Migration Commands

### Development
```bash
# Create a new migration after schema changes
npx prisma migrate dev --name add_user_field

# Reset database and apply all migrations (⚠️ WARNING: Deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Production
```bash
# Apply pending migrations in production
npx prisma migrate deploy

# Never use 'migrate dev' in production!
```

## Example Workflow

1. **Modify schema** in `prisma/schema.prisma`
   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     // Add new field
     phone     String?
   }
   ```

2. **Create migration**
   ```bash
   npx prisma migrate dev --name add_user_phone
   ```

3. **Commit migration files** to git
   ```bash
   git add prisma/migrations
   git commit -m "Add phone field to User model"
   ```

4. **Team members pull and apply**
   ```bash
   git pull
   npx prisma migrate dev  # Applies pending migrations
   ```

## Troubleshooting

### "Migration failed" error
- Check database connection in `.env`
- Ensure PostgreSQL is running
- Review migration SQL for conflicts

### "Database is out of sync"
```bash
npx prisma migrate resolve --applied <migration_name>
```

### Start fresh (Development only)
```bash
npx prisma migrate reset
npx prisma db seed  # If you have a seed script
```

## Best Practices

1. ✅ **Always** create migrations for schema changes
2. ✅ **Test** migrations in development first
3. ✅ **Commit** migration files to version control
4. ✅ **Review** generated SQL before applying
5. ❌ **Never** modify existing migrations
6. ❌ **Never** use `db push` in production
7. ❌ **Never** use `migrate dev` in production

## Need Help?

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Migration Troubleshooting](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-development)
