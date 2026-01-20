# Backend Utility Scripts

This folder contains utility scripts for database management, testing, and maintenance tasks.

## Database Management Scripts

### Data Population
- **`add-modules-lessons.ts`** - Add modules and lessons to courses
- **`expand-content-v2.ts`** - Generate expanded lesson content
- **`update-quizzes.ts`** - Update quiz data in database

### Data Verification
- **`check-users.ts`** - List and verify database users
- **`check-user.js`** - Check specific user details
- **`check-videos.ts`** - Verify video URLs are valid
- **`check-data-protection-lessons.ts`** - Check specific course lessons

### Data Cleanup
- **`delete-student.ts`** - Remove test student accounts

## Testing Scripts

### API Testing
- **`test-lessons-api.js`** - Test lesson API endpoints
- **`test-login.js`** - Test authentication endpoints

### AI Testing
- **`test-gemini.js`** - Test Google Gemini AI integration
- **`test-gemini-quota.js`** - Check AI API quota usage

### Video Testing
- **`test-video-embed.html`** - Test YouTube video embedding

## Usage

All scripts should be run from the `backend` directory:

```bash
# TypeScript scripts
npx tsx scripts/check-users.ts

# JavaScript scripts
node scripts/test-login.js
```

## Notes

- These scripts are for development/maintenance only
- They do not affect the running application
- Main application code is in `src/` folder
- Always backup data before running modification scripts
