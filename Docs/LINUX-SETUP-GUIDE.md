# CyberGuard AI - Linux Setup Guide

> This guide is for setting up CyberGuard AI on **Linux Mint 23.3**
> Written for beginners - no prior Linux experience needed!

---

## What You Received

You should have these folders/files:

```
CyberGuard-AI/
├── frontend/           <- The website users see
├── backend/            <- The server that handles data
├── Docs/               <- Documentation (including this guide)
└── cyberguard-backup.sql   <- Database backup file
```

---

## What You Need to Install

Before the app can run, you need to install some software on your Linux computer.

### Step 1: Open Terminal

Press `Ctrl + Alt + T` or search for "Terminal" in your applications menu.

All commands below are typed into the Terminal and run by pressing `Enter`.

---

### Step 2: Update Your System

This makes sure your computer has the latest software lists.

```bash
sudo apt update && sudo apt upgrade -y
```

> **What's happening?** `sudo` means "run as administrator". You'll be asked for your password.
> The `-y` means "yes to all questions".

---

### Step 3: Install Node.js

Node.js is what runs the backend server and builds the frontend.

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify it installed:
```bash
node --version
```
You should see something like `v18.x.x` or higher.

---

### Step 4: Install PostgreSQL (The Database)

PostgreSQL stores all the courses, users, and progress data.

```bash
sudo apt install -y postgresql postgresql-contrib
```

Start the database service:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

> **What's happening?** `systemctl start` turns it on now. `enable` makes it start automatically when you boot your computer.

---

### Step 5: Create the Database

Now we create a place to store the app's data.

Enter the PostgreSQL prompt:
```bash
sudo -u postgres psql
```

Your terminal will change to show `postgres=#`. Type these commands one at a time:

```sql
CREATE DATABASE cyberguard;
CREATE USER cyberuser WITH ENCRYPTED PASSWORD 'your-password-here';
GRANT ALL PRIVILEGES ON DATABASE cyberguard TO cyberuser;
ALTER DATABASE cyberguard OWNER TO cyberuser;
\c cyberguard
GRANT ALL ON SCHEMA public TO cyberuser;
\q
```

> **Important:** Replace `your-password-here` with a password you'll remember. You'll need it later.
> The `\q` command exits the PostgreSQL prompt.

---

### Step 6: Import the Database Backup

This loads all the existing courses, lessons, and user data.

```bash
psql -U cyberuser -d cyberguard -h localhost -f /path/to/cyberguard-backup.sql
```

> **Note:** Replace `/path/to/cyberguard-backup.sql` with the actual location of your backup file.
> Example: `~/Documents/CyberGuard-AI/cyberguard-backup.sql`

You'll be asked for the password you created in Step 5.

---

### Step 7: Setup the Backend

Navigate to the backend folder:
```bash
cd /path/to/CyberGuard-AI/backend
```

Install the required packages:
```bash
npm install
```

> **What's happening?** This downloads all the code libraries the backend needs. May show some warnings - that's normal.

Create the configuration file:
```bash
nano .env
```

This opens a text editor. Type the following (adjust values as needed):

```
DATABASE_URL="postgresql://cyberuser:your-password-here@localhost:5432/cyberguard"
JWT_SECRET="pick-any-random-phrase-here-make-it-long"
PORT=3000
GEMINI_API_KEY="your-google-api-key"
```

> **What are these?**
> - `DATABASE_URL` - Tells the app how to connect to your database
> - `JWT_SECRET` - A secret phrase used to secure user logins (can be anything, just keep it private)
> - `PORT` - Which port the backend runs on (3000 is standard)
> - `GEMINI_API_KEY` - For the AI tutor feature (get one from Google AI Studio if needed)

Save the file: Press `Ctrl + O`, then `Enter`, then `Ctrl + X` to exit.

Generate the database client:
```bash
npx prisma generate
```

---

### Step 8: Setup the Frontend

Open a **new terminal window** (Ctrl + Alt + T) and navigate to frontend:
```bash
cd /path/to/CyberGuard-AI/frontend
```

Install the required packages:
```bash
npm install
```

---

## Running the Application

You need **two terminal windows** open - one for backend, one for frontend.

### Terminal 1 - Start Backend:
```bash
cd /path/to/CyberGuard-AI/backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Health check: http://localhost:3000/api/health
```

### Terminal 2 - Start Frontend:
```bash
cd /path/to/CyberGuard-AI/frontend
npm run dev
```

You should see:
```
VITE ready
Local: http://localhost:5173/
```

### Open in Browser:

Go to: **http://localhost:5173**

That's it! The application is running.

---

## Test Accounts

Use these to log in and test the application:

**Student Account:**
- Email: `akeemkippins.gy@gmail.com`
- Password: `C0c@1n380Z`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

---

## Stopping the Application

In each terminal window, press `Ctrl + C` to stop the server.

---

## Quick Reference (Daily Use)

Once everything is set up, this is all you need to do each time:

```bash
# Terminal 1
cd /path/to/CyberGuard-AI/backend && npm run dev

# Terminal 2
cd /path/to/CyberGuard-AI/frontend && npm run dev

# Then open browser to http://localhost:5173
```

---

## Troubleshooting

### "Command not found: node"
Node.js isn't installed. Redo Step 3.

### "Connection refused" or database errors
PostgreSQL isn't running. Run:
```bash
sudo systemctl start postgresql
```

### "Cannot find module" errors
Dependencies aren't installed. Run `npm install` in the folder that's giving errors.

### Backend starts but frontend can't connect
Make sure the backend is running on port 3000. Check the `.env` file has `PORT=3000`.

### "Permission denied" errors
Add `sudo` before the command, or check file ownership.

---

## Getting Help

If you run into issues:
1. Read the error message carefully - it often tells you what's wrong
2. Make sure both terminals show the servers running without errors
3. Check that PostgreSQL is running: `sudo systemctl status postgresql`
4. Verify your `.env` file has the correct database password

---

**End of Setup Guide**
