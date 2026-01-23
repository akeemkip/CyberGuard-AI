# CyberGuard AI - Linux Setup Guide

> This guide is for setting up CyberGuard AI on **Linux Mint 23.3**
> Written for beginners - no prior Linux experience needed!

---

## Prerequisites

Before starting, make sure you have:
- A computer running Linux Mint 23.3
- An internet connection
- About 30-45 minutes for the full setup

---

## Step 1: Open Terminal

Press `Ctrl + Alt + T` or search for "Terminal" in your applications menu.

All commands below are typed into the Terminal and run by pressing `Enter`.

---

## Step 2: Update Your System

This makes sure your computer has the latest software lists.

```bash
sudo apt update && sudo apt upgrade -y
```

> **What's happening?** `sudo` means "run as administrator". You'll be asked for your password.
> The `-y` means "yes to all questions".

---

## Step 3: Install Git

Git is used to download the project from GitHub.

```bash
sudo apt install -y git
```

---

## Step 4: Clone the Project from GitHub

Download the project to your computer:

```bash
cd ~/Documents
git clone https://github.com/akeemkip/CyberGuard-AI.git
cd CyberGuard-AI
```

> **What's happening?** This downloads all the project files to `~/Documents/CyberGuard-AI/`

You should now have these folders:

```
CyberGuard-AI/
├── frontend/           <- The website users see
├── backend/            <- The server that handles data
├── Docs/               <- Documentation (including this guide)
│   └── cyberguard_backup.sql   <- Database backup file
└── ...
```

---

## Step 5: Install Node.js

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

## Step 6: Install PostgreSQL (The Database)

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

## Step 7: Configure PostgreSQL Authentication

By default, PostgreSQL on Linux uses "peer" authentication which can cause connection issues. Let's configure it to allow password authentication.

Find your PostgreSQL version:
```bash
ls /etc/postgresql/
```
This will show a number like `14` or `15`. Remember this number.

Edit the authentication config file (replace `14` with your version number):
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Scroll down to find the lines that look like this:
```
# "local" is for Unix domain socket connections only
local   all             all                                     peer
```

Change `peer` to `md5`:
```
# "local" is for Unix domain socket connections only
local   all             all                                     md5
```

Also find this line:
```
host    all             all             127.0.0.1/32            scram-sha-256
```

Change `scram-sha-256` to `md5`:
```
host    all             all             127.0.0.1/32            md5
```

Save the file: Press `Ctrl + O`, then `Enter`, then `Ctrl + X` to exit.

Restart PostgreSQL for changes to take effect:
```bash
sudo systemctl restart postgresql
```

---

## Step 8: Create the Database

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

## Step 9: Import the Database Backup

This loads all the existing courses, lessons, and sample data.

```bash
cd ~/Documents/CyberGuard-AI
psql -U cyberuser -d cyberguard -h localhost -f Docs/cyberguard_backup.sql
```

You'll be asked for the password you created in Step 8.

> **Note:** You may see some notices or warnings - that's usually normal. As long as you don't see "ERROR" messages, it worked.

---

## Step 10: Setup the Backend

Navigate to the backend folder:
```bash
cd ~/Documents/CyberGuard-AI/backend
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
> - `DATABASE_URL` - Tells the app how to connect to your database (use the password from Step 8)
> - `JWT_SECRET` - A secret phrase used to secure user logins (can be anything, just keep it private)
> - `PORT` - Which port the backend runs on (3000 is standard)
> - `GEMINI_API_KEY` - For the AI tutor feature (get one free from [Google AI Studio](https://makersuite.google.com/app/apikey) if needed)

Save the file: Press `Ctrl + O`, then `Enter`, then `Ctrl + X` to exit.

Generate the database client:
```bash
npx prisma generate
```

---

## Step 11: Setup the Frontend

Open a **new terminal window** (Ctrl + Alt + T) and navigate to frontend:
```bash
cd ~/Documents/CyberGuard-AI/frontend
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
cd ~/Documents/CyberGuard-AI/backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Health check: http://localhost:3000/api/health
```

### Terminal 2 - Start Frontend:
```bash
cd ~/Documents/CyberGuard-AI/frontend
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

**Admin Account:**
- Email: `admin@cyberguard.local`
- Password: `admin123`

**Student Account:**
- Email: `student@cyberguard.local`
- Password: `student123`

> **Note:** These are test accounts included in the database backup. You can create additional accounts through the registration page or admin panel.

---

## Stopping the Application

In each terminal window, press `Ctrl + C` to stop the server.

---

## Quick Reference (Daily Use)

Once everything is set up, this is all you need to do each time:

```bash
# Terminal 1 - Start Backend
cd ~/Documents/CyberGuard-AI/backend && npm run dev

# Terminal 2 - Start Frontend
cd ~/Documents/CyberGuard-AI/frontend && npm run dev

# Then open browser to http://localhost:5173
```

---

## Troubleshooting

### "Command not found: node"
Node.js isn't installed. Redo Step 5.

### "Command not found: git"
Git isn't installed. Run: `sudo apt install git`

### "Connection refused" or database errors
PostgreSQL isn't running. Run:
```bash
sudo systemctl start postgresql
```

### "password authentication failed for user cyberuser"
Either the password is wrong, or PostgreSQL authentication isn't configured correctly:
1. Double-check your password in the `.env` file matches what you set in Step 8
2. Make sure you completed Step 7 (configuring pg_hba.conf)
3. Restart PostgreSQL: `sudo systemctl restart postgresql`

### "Cannot find module" errors
Dependencies aren't installed. Run `npm install` in the folder that's giving errors.

### Backend starts but frontend can't connect
Make sure the backend is running on port 3000. Check the `.env` file has `PORT=3000`.

### "Permission denied" errors
Add `sudo` before the command, or check file ownership.

### Database import shows errors
If you see "role cyberuser does not exist" or similar, make sure you completed Step 8 before Step 9.

---

## Updating the Project

If you receive updates to the code:

```bash
cd ~/Documents/CyberGuard-AI
git pull origin main
cd backend && npm install
cd ../frontend && npm install
```

Then restart both servers.

---

## Getting Help

If you run into issues:
1. Read the error message carefully - it often tells you what's wrong
2. Make sure both terminals show the servers running without errors
3. Check that PostgreSQL is running: `sudo systemctl status postgresql`
4. Verify your `.env` file has the correct database password

---

**End of Setup Guide**
