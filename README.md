# CyberGuard AI

A comprehensive cybersecurity training platform built with React, Node.js, Express, and PostgreSQL.

## Features

### Student Features
- **Course Catalog** - Browse and enroll in cybersecurity courses
- **Course Player** - Video lessons with progress tracking
- **Quizzes** - Test knowledge with scored assessments
- **Certificates** - Earn certificates for completed courses
- **Skill Assessments** - 15-question comprehensive skill tests
- **AI Chat** - Cybersecurity assistant (mock implementation)
- **Progress Dashboard** - Track learning progress

### Admin Features
- **Dashboard** - Platform statistics and analytics
- **User Management** - View, search, and manage users
- **Content Management** - Full CRUD for courses
- **Analytics** - Enrollment trends and completion rates

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS v4
- shadcn/ui + Radix UI components
- Recharts for data visualization
- Axios for API calls

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Zod validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akeemkip/Josh.git
   cd Josh
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Create .env file (copy from .env.example)
   cp .env.example .env
   # Edit .env with your database credentials

   # Set up database
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev    # Runs on http://localhost:3000

   # Terminal 2 - Frontend
   cd frontend
   npm run dev    # Runs on http://localhost:5173
   ```

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Student | akeemkippins.gy@gmail.com | C0c@1n380Z |

## Project Structure

```
Josh/
├── frontend/           # React frontend
│   ├── src/app/
│   │   ├── components/ # UI components
│   │   ├── context/    # React contexts
│   │   └── services/   # API services
│   └── ...
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   └── prisma/         # Database schema & seeds
└── Docs/               # Documentation
```

## Documentation

See [CONTEXT.md](./Docs/CONTEXT.md) for comprehensive project documentation including:
- Tech stack and architecture
- Database schema
- API endpoints
- Development patterns
- Quick reference commands

## License

MIT
