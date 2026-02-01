# CyberGuard-AI Database Import Guide for Joshua

## 📦 Database Export Information

- **Exported from:** PostgreSQL 18 (Windows)
- **Target:** PostgreSQL 16+ (Linux Mint 23.3)
- **File:** `cyberguard_database.sql` (645KB)
- **Export date:** February 1, 2026
- **Compatibility:** Cross-version compatible (uses plain SQL format)

---

## ✅ Cross-Version Compatibility Features

This export was created with special flags to ensure compatibility:

- ✅ **`--no-owner`** - No ownership dependencies
- ✅ **`--no-privileges`** - No permission conflicts
- ✅ **`--clean`** - Drops existing objects before recreating
- ✅ **`--if-exists`** - Safe drop statements (won't fail if object doesn't exist)
- ✅ **`--column-inserts`** - Column-specific inserts (more portable)
- ✅ **Plain SQL format** - Works across all PostgreSQL versions 10+

**Result:** This dump will work perfectly from PostgreSQL 18 → 16!

---

## 🚀 Import Instructions (Linux Mint 23.3)

### Step 1: Ensure PostgreSQL 16 is Running

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql
```

### Step 2: Create the Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE cyberguard;

# Exit psql
\q
```

### Step 3: Import the Database

```bash
# Navigate to the repository
cd ~/CyberGuard-AI/docs

# Import the database (will take 10-30 seconds)
sudo -u postgres psql cyberguard < cyberguard_database.sql
```

You should see output like:
```
DROP EXTENSION
CREATE EXTENSION
DROP TABLE
CREATE TABLE
INSERT 0 1
INSERT 0 1
...
```

### Step 4: Verify Import

```bash
# Connect to database
sudo -u postgres psql cyberguard

# Check tables
\dt

# Check user count
SELECT COUNT(*) FROM "User";

# Check course count
SELECT COUNT(*) FROM "Course";

# Exit
\q
```

---

## 🔧 Configure Your Backend

Update your `.env` file:

```env
# Database connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cyberguard?schema=public"

# Generate new JWT secret (don't use the same one!)
# Run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-unique-jwt-secret-different-from-original"

# Generate new encryption key
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY="your-unique-encryption-key"

# Server configuration
PORT=3000
NODE_ENV="development"

# Your frontend URL
FRONTEND_URL="http://localhost:5173"

# Your Google Gemini API key (or leave blank if not using)
GEMINI_API_KEY=""
```

---

## 🗄️ What's Included in This Database

### Users:
- ✅ Admin account: `admin@cyberguard.com`
- ✅ Demo students with various skill levels
- ✅ Student accounts with completed courses
- ✅ Student accounts in progress
- ✅ Fresh accounts with no progress

### Courses & Content:
- ✅ Password Security course (complete)
- ✅ Phishing Awareness course (complete)
- ✅ Network Security Fundamentals (complete)
- ✅ Advanced Penetration Testing (complete)
- ✅ All lessons, quizzes, and lab content
- ✅ Video content links

### Progress Data:
- ✅ Student enrollments
- ✅ Lesson completion records
- ✅ Quiz attempts and scores
- ✅ Course progress percentages
- ✅ Certificates for completed courses
- ✅ Assessment scores

### Phishing Simulation:
- ✅ Phishing simulation records
- ✅ Student responses (passed/failed)
- ✅ Click tracking data
- ✅ Response times

### Platform Settings:
- ✅ Configured platform settings
- ✅ Security settings
- ✅ Email settings (you'll need to configure SMTP)

---

## ⚠️ Important Notes

### 1. **Reset Admin Password**
The admin password in this database is `admin123`. Change it immediately:

```bash
# Connect to database
sudo -u postgres psql cyberguard

# Update admin password (hash for new password)
# Or change it through the UI after login
```

### 2. **Generate New Secrets**
NEVER use the same JWT_SECRET or ENCRYPTION_KEY as the original database:

```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate new encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Prisma Client**
After importing, generate Prisma client:

```bash
cd ~/CyberGuard-AI/backend
npm install
npx prisma generate
```

### 4. **Start the Backend**
```bash
cd ~/CyberGuard-AI/backend
npm run dev
```

---

## 🐛 Troubleshooting

### Error: "database 'cyberguard' already exists"
```bash
# Drop and recreate
sudo -u postgres psql
DROP DATABASE cyberguard;
CREATE DATABASE cyberguard;
\q

# Then import again
```

### Error: "permission denied"
```bash
# Make sure you're using postgres user
sudo -u postgres psql cyberguard < cyberguard_database.sql
```

### Error: "relation X already exists"
This is normal! The `--clean` flag drops tables before creating them.
Just ignore these warnings.

### Error: "role 'postgres' does not exist"
```bash
# Create postgres user
sudo -u postgres createuser --superuser $USER
```

---

## ✅ Verification Checklist

After import, verify:

- [ ] Database contains tables (run `\dt` in psql)
- [ ] Users exist (check `SELECT COUNT(*) FROM "User";`)
- [ ] Courses exist (check `SELECT COUNT(*) FROM "Course";`)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Can login with admin credentials
- [ ] Can see courses and progress data

---

## 🎉 Success!

You now have an exact copy of the CyberGuard-AI database!

**Next steps:**
1. Configure your `.env` file
2. Generate Prisma client
3. Start the backend
4. Login and explore

If you encounter any issues, check the troubleshooting section or reach out!

---

## 📊 Database Schema Reference

For detailed schema information, see:
- `backend/prisma/schema.prisma` - Complete database schema
- Run `npx prisma studio` - Visual database browser

---

**Compatibility:** ✅ PostgreSQL 16.x on Linux Mint 23.3
**Source:** PostgreSQL 18 on Windows
**Format:** Plain SQL (cross-platform)
**Size:** 645KB
