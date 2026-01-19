# Frontend Lesson Testing Guide

## Test Environment
- **Frontend URL**: http://localhost:5177
- **Backend URL**: http://localhost:3000
- **Status**: ✅ Both servers running

## What to Test

### 1. Course List Page
**URL**: http://localhost:5177/courses

**Verify**:
- [ ] All 6 courses display
- [ ] Course cards show thumbnails
- [ ] Lesson counts are correct (should be 11 lessons per course now, not 3)
- [ ] Click on any course to view details

### 2. Course Detail Page
**URL**: http://localhost:5177/courses/[course-id]

**Verify**:
- [ ] Course information displays
- [ ] Modules are visible (each course should have 3 modules)
- [ ] Lessons are organized under modules
- [ ] Each lesson shows in correct order
- [ ] Can enroll in course

### 3. Lesson Player
**URL**: Navigate to a lesson by enrolling and clicking "Start Course"

**Verify**:
- [ ] Lesson content renders properly with markdown formatting
- [ ] Headings, lists, code blocks display correctly
- [ ] Content is comprehensive (30-100+ lines visible)
- [ ] Videos load properly (YouTube iframe embeds)
- [ ] Video player controls work
- [ ] Navigation between lessons works
- [ ] Progress tracking updates

### 4. Specific Lessons to Test

#### Test Case 1: Quid Pro Quo Attacks
**Course**: Social Engineering Awareness
**What to check**:
- [ ] Content covers definition, scenarios, red flags
- [ ] Real-world case studies visible
- [ ] Key takeaways at the end
- [ ] Video: https://www.youtube.com/watch?v=NB8OceGZGjA

#### Test Case 2: Privacy by Design
**Course**: Personal Data Protection
**What to check**:
- [ ] Content covers 7 foundational principles
- [ ] Examples and implementation phases visible
- [ ] GDPR context mentioned
- [ ] Video: https://www.youtube.com/watch?v=vNyJFdzXpnQ

#### Test Case 3: Secure Data Disposal
**Course**: Personal Data Protection
**What to check**:
- [ ] Content covers different disposal methods
- [ ] SSD vs HDD differences explained
- [ ] Legal requirements section visible
- [ ] Video: https://www.youtube.com/watch?v=0ecoGqVHFIg

#### Test Case 4: Building Phishing Resistance
**Course**: Secure Web Browsing or Social Engineering
**What to check**:
- [ ] Comprehensive psychology section
- [ ] Technical controls explained
- [ ] Behavioral habits detailed
- [ ] Video: https://www.youtube.com/watch?v=OB5L8pVvCZs

## Quick Test Courses

### Password Security Best Practices
- Should have 11 lessons across 3 modules
- Module 1: Password Fundamentals (2 lessons)
- Module 2: Creating Strong Credentials (3 lessons)
- Module 3: Advanced Protection (6 lessons)
- Check lessons: "Password Recovery and Reset", "Security Questions Best Practices"

### Social Engineering Awareness
- Should have 11 lessons across 3 modules
- Check new lessons: "Quid Pro Quo Attacks", "Watering Hole Attacks", "Social Engineering Red Flags"

### Secure Web Browsing
- Should have 11 lessons
- Check new lessons: "Understanding Web Trackers", "Safe Online Shopping", "Protecting Against Malvertising", "Building Phishing Resistance"

## Video Test Checklist

For each lesson with a video:
- [ ] YouTube player loads
- [ ] Video thumbnail displays
- [ ] Play button works
- [ ] Fullscreen option available
- [ ] No CORS or embedding errors

## Content Quality Checklist

For each lesson:
- [ ] Content has multiple sections with H2/H3 headings
- [ ] Lists and bullet points render correctly
- [ ] Bold and italic text formats properly
- [ ] Code blocks (if any) display with proper formatting
- [ ] Links are clickable
- [ ] No escaped characters visible (like \` instead of `)
- [ ] Content is at least 30+ lines (comprehensive)

## Known Test Accounts

If you need to login to test:
- Check your existing user accounts in the database
- Or create a new account through the signup flow

## Troubleshooting

### Videos Not Loading
- Check browser console for errors
- Verify YouTube URLs are accessible
- Check network tab for blocked requests

### Content Not Displaying
- Check backend API response in browser DevTools
- Verify database has been updated (run `npm run check-videos.ts`)
- Check for markdown rendering issues

### Module Organization Issues
- Verify course controller includes module data
- Check that lessons are assigned to correct modules
- Verify module order is correct

## Success Criteria

✅ **All tests pass if**:
- All 63 lessons display across 6 courses
- Every lesson has comprehensive content (1000+ characters)
- Videos load and play properly
- Markdown renders correctly
- Module organization is visible
- Navigation works smoothly
- Progress tracking functions

## Quick Backend Verification

Run this to verify lesson count:
```bash
cd backend && npx tsx check-videos.ts
```

Expected output:
```
Total lessons needing content: 0
Already updated with comprehensive content: 63
```
