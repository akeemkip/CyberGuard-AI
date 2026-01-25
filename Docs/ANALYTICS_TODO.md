# Analytics & Reports Page - TODO List

**Status:** 🟢 Priority 1 Complete - Testing Passed
**Started:** January 25, 2026
**Last Updated:** January 25, 2026
**Completion:** 18/47 tasks (38%)

---

## 📊 Overview

The Analytics & Reports page currently shows mostly **fake/mock data**. This document tracks all improvements needed to make it production-ready with real data from the database.

---

## 🔴 Priority 1: Fix Fake Data (CRITICAL)

These items show misleading information to users and must be fixed first.

### Backend - Create Real Data Endpoints

- [x] **Create GET /api/admin/analytics endpoint**
  - [x] Add route in `backend/src/routes/admin.routes.ts`
  - [x] Create `getAnalytics()` method in admin controller
  - [x] Support date range filtering (7/30/90 days, year)
  - [x] Support report type filtering (overview, user, course, engagement)

- [x] **User Progression Data**
  - [x] Query enrollments by week for last 8 weeks
  - [x] Count new users registered per week
  - [x] Count course completions per week
  - [x] Return format: `{ date: string, users: number, completion: number }[]`

- [x] **Skill Proficiency Data**
  - [x] Calculate average quiz scores by course topic
  - [x] Group by skill domain (Phishing, Passwords, Social Engineering, etc.)
  - [x] Return format: `{ skill: string, proficiency: number }[]`

- [x] **Engagement Metrics**
  - [x] ~~Track lesson view timestamps (add to Progress model if needed)~~ Using lesson completions
  - [x] Calculate average time spent per month (estimated)
  - [x] Count total sessions per month
  - [x] Return format: `{ month: string, time: number, sessions: number }[]`
  - Note: Time tracking is estimated (30 mins per lesson). Full time tracking needs Progress model updates.

- [x] **Knowledge Retention**
  - [x] Track quiz retakes over time
  - [x] Calculate percentage who maintain passing scores
  - [x] Group by week since course completion
  - [x] Return format: `{ week: string, retention: number }[]`

- [x] **Top Performing Users**
  - [x] Query top 10 users by courses completed
  - [x] Calculate average quiz score per user
  - [x] Calculate total time spent (estimated)
  - [x] Get last active timestamp
  - [x] Return format: `{ id, name, coursesCompleted, avgScore, timeSpent, lastActive }[]`

- [x] **Lab Analytics (NEW)**
  - [x] Count total lab attempts
  - [x] Calculate average lab scores
  - [x] Track lab completion rate
  - [x] Group by lab type (Phishing, Password, etc.)
  - [x] Return format: `{ labType: string, attempts: number, avgScore: number, completionRate: number }[]`

### Frontend - Connect to Real Data

- [x] **Update admin.service.ts**
  - [x] Add `getAnalytics(dateRange, reportType)` method
  - [x] Define TypeScript interfaces for all analytics data
  - [x] Handle loading states and errors

- [x] **Update admin-analytics.tsx**
  - [x] Remove all mock data variables (lines 51-95) - ALL REMOVED
  - [x] Fetch real data from backend on mount
  - [x] Pass date range filter to API
  - [x] Pass report type filter to API
  - [x] Update all chart data sources to use real data
  - [x] Show loading states for each chart section

- [x] **User Progression Chart**
  - [x] Connect to real `userProgressionData` from API
  - [x] Show both enrollments and completions
  - [x] Add empty state for no data

- [x] **Skill Proficiency Chart**
  - [x] Connect to real `skillProficiencyData` from API
  - [x] Add empty state message
  - [x] Show "No quiz data available" message

- [x] **Engagement Metrics Chart**
  - [x] Connect to real `engagementData` from API
  - [x] Using estimated time (30 mins per lesson)
  - [x] Show "No engagement data" message when empty

- [x] **Knowledge Retention Chart**
  - [x] Connect to real `retentionData` from API
  - [x] Quiz retake tracking implemented
  - [x] Show "(requires quiz retakes)" message when empty

- [x] **Top Performers Table**
  - [x] Replace fake data with real users from API
  - [x] Show "No users" message if empty
  - [x] Button links to admin-users page
  - [ ] Make rows clickable to view user details (future)
  - [ ] Add pagination if > 10 users (future)

---

## 🟡 Priority 2: Make Filters Functional

Currently filters change state but don't affect displayed data.

### Date Range Filter

- [ ] **Backend filtering**
  - [ ] Accept `dateRange` parameter (7days, 30days, 90days, year)
  - [ ] Filter all queries by date range
  - [ ] Handle "custom" range (future enhancement)

- [ ] **Frontend integration**
  - [ ] Re-fetch data when date range changes
  - [ ] Show loading state during re-fetch
  - [ ] Update chart labels to reflect selected range

### Report Type Filter

- [ ] **Create different views**
  - [ ] Overview (current default view)
  - [ ] User Performance (focus on student stats)
  - [ ] Course Analytics (per-course breakdown)
  - [ ] Engagement Metrics (time spent, sessions)

- [ ] **Implement view switching**
  - [ ] Create separate components for each view type
  - [ ] Show/hide sections based on selected report type
  - [ ] Fetch appropriate data for each type

---

## 🟢 Priority 3: Add Export Functionality

Currently export buttons just show alerts.

### CSV Export

- [ ] **Backend endpoint**
  - [ ] Create POST /api/admin/analytics/export endpoint
  - [ ] Generate CSV from current analytics data
  - [ ] Accept same filters (dateRange, reportType)
  - [ ] Return CSV file download

- [ ] **Frontend implementation**
  - [ ] Call export endpoint with current filters
  - [ ] Trigger file download in browser
  - [ ] Show success/error toast
  - [ ] Add loading state to button

### PDF Export

- [ ] **Backend implementation**
  - [ ] Install PDF generation library (e.g., pdfkit, puppeteer)
  - [ ] Create professional PDF template
  - [ ] Include all charts as images
  - [ ] Add company branding
  - [ ] Generate date/time stamp

- [ ] **Frontend implementation**
  - [ ] Call PDF export endpoint
  - [ ] Trigger file download
  - [ ] Show generation progress
  - [ ] Add preview option (future)

---

## 🔵 Priority 4: Add Missing Analytics

New features that would greatly enhance the page.

### Lab Analytics Section

- [ ] **New card: Lab Performance**
  - [ ] Total labs completed
  - [ ] Average lab score
  - [ ] Pass rate
  - [ ] Most difficult lab type

- [ ] **Lab Completion Chart**
  - [ ] Bar chart by lab type
  - [ ] Show completion rate per type
  - [ ] Color-code by difficulty

- [ ] **Lab Type Breakdown**
  - [ ] Pie chart of lab attempts by type
  - [ ] Show which labs are most popular
  - [ ] Click to drill down

### Course-Level Analytics

- [ ] **Course Performance Table**
  - [ ] List all courses
  - [ ] Show enrollment count
  - [ ] Show completion rate
  - [ ] Show average quiz score
  - [ ] Sort by any column
  - [ ] Click to see course details

- [ ] **Per-Course Drill-Down**
  - [ ] View individual course analytics
  - [ ] Lesson-by-lesson breakdown
  - [ ] Quiz performance by question
  - [ ] Student list for course

### Question Difficulty Analysis

- [ ] **Quiz Question Stats**
  - [ ] Calculate success rate per question
  - [ ] Identify hardest questions (< 50% success)
  - [ ] Show in sortable table
  - [ ] Recommend question review/rewrite

- [ ] **Question Performance Chart**
  - [ ] Scatter plot: difficulty vs. discrimination
  - [ ] Highlight poorly performing questions
  - [ ] Add tooltips with question text

### Time-Based Analytics

- [ ] **Add time tracking to database**
  - [ ] Add `startedAt` timestamp to Progress model
  - [ ] Calculate time spent per lesson
  - [ ] Track session duration

- [ ] **Time-Based Metrics**
  - [ ] Average time to complete course
  - [ ] Time spent per lesson
  - [ ] Peak activity hours/days
  - [ ] User session length distribution

### Cohort Analysis

- [ ] **Group users by enrollment date**
  - [ ] Weekly cohorts
  - [ ] Track retention by cohort
  - [ ] Compare cohort performance
  - [ ] Show cohort progression chart

---

## 🎨 Priority 5: UI/UX Improvements

Enhancements to make the page more professional and usable.

### Visual Improvements

- [ ] **Add empty states**
  - [ ] Show helpful message when no data exists
  - [ ] Add illustration or icon
  - [ ] Provide action button (e.g., "Add Users")

- [ ] **Improve chart styling**
  - [ ] Consistent color scheme across all charts
  - [ ] Better tooltips with more context
  - [ ] Smooth animations on data load
  - [ ] Responsive sizing for mobile

- [ ] **Add data refresh**
  - [ ] Manual refresh button
  - [ ] Auto-refresh every 5 minutes (optional)
  - [ ] Show last updated timestamp

### Interactivity

- [ ] **Make charts clickable**
  - [ ] Click bar/pie slice to filter data
  - [ ] Drill down to details
  - [ ] Breadcrumb navigation for drill-downs

- [ ] **Add comparison mode**
  - [ ] Compare current vs. previous period
  - [ ] Show percentage change indicators
  - [ ] Add trend arrows (up/down)

- [ ] **Add data table views**
  - [ ] Toggle between chart and table view
  - [ ] Export individual table data
  - [ ] Sort and filter tables

### Accessibility

- [ ] **ARIA labels for charts**
  - [ ] Screen reader support
  - [ ] Keyboard navigation
  - [ ] High contrast mode support

- [ ] **Responsive design**
  - [ ] Test on mobile devices
  - [ ] Ensure charts scale properly
  - [ ] Stack charts on small screens

---

## 🧪 Testing Checklist

Before marking complete, verify all these work:

### Functional Testing

- [ ] All charts display real data
- [ ] Date range filter updates all charts
- [ ] Report type filter switches views
- [ ] Export CSV downloads valid file
- [ ] Export PDF generates readable document
- [ ] Top performers table shows actual users
- [ ] All loading states display correctly
- [ ] Error states handled gracefully

### Data Accuracy

- [ ] Stats match database queries
- [ ] Chart totals are correct
- [ ] Percentages calculated properly
- [ ] Date ranges filter correctly
- [ ] No stale/cached data issues

### Performance

- [ ] Page loads in < 2 seconds
- [ ] Charts render smoothly
- [ ] No lag when changing filters
- [ ] Export completes in reasonable time
- [ ] Database queries optimized

### Cross-Browser

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## 📝 Implementation Notes

### Database Changes Needed

1. **Progress Table:**
   - Add `startedAt` timestamp (nullable)
   - Add `timeSpent` integer (minutes)

2. **QuizAttempt Table:**
   - Ensure `attemptedAt` is indexed for performance
   - Consider adding `retakeNumber` field

3. **Lab Progress Table:**
   - Already has scoring fields (good!)
   - Ensure all lab types are tracked

### Backend API Structure

```typescript
// Recommended endpoint structure
GET /api/admin/analytics
Query params:
  - dateRange: '7days' | '30days' | '90days' | 'year'
  - reportType: 'overview' | 'user' | 'course' | 'engagement'

Response:
{
  stats: { /* top 4 card metrics */ },
  userProgression: [...],
  skillProficiency: [...],
  engagement: [...],
  retention: [...],
  topUsers: [...],
  labAnalytics: [...],
  courseBreakdown: [...]
}
```

### Frontend TypeScript Interfaces

```typescript
interface AnalyticsData {
  stats: AnalyticsStats;
  userProgression: UserProgressionPoint[];
  skillProficiency: SkillProficiencyData[];
  engagement: EngagementData[];
  retention: RetentionData[];
  topUsers: TopUser[];
  labAnalytics: LabAnalyticsData[];
  courseBreakdown: CourseAnalyticsData[];
}
```

---

## 📅 Timeline Estimate

- **Priority 1 (Fix Fake Data):** 6-8 hours
- **Priority 2 (Filters):** 2-3 hours
- **Priority 3 (Export):** 3-4 hours
- **Priority 4 (New Features):** 8-10 hours
- **Priority 5 (UI/UX):** 4-5 hours
- **Testing:** 2-3 hours

**Total Estimated Time:** 25-33 hours

---

## 🎯 Success Criteria

The Analytics & Reports page is complete when:

1. ✅ **No fake/mock data** - All charts show real database information
2. ✅ **All filters work** - Date range and report type affect displayed data
3. ✅ **Export works** - CSV and PDF generate accurate reports
4. ✅ **Lab analytics included** - New lab system is tracked and displayed
5. ✅ **Performance is good** - Page loads quickly, no lag
6. ✅ **Mobile responsive** - Works on all screen sizes
7. ✅ **Accessible** - Screen reader compatible, keyboard navigable
8. ✅ **Well documented** - Code comments, API documentation updated

---

## 📌 Current Focus

**Next Task:** Start Priority 1 - Backend endpoint for real analytics data

**Working On:** Creating GET /api/admin/analytics endpoint

---

## 🔄 Progress Log

### Session 1 - January 25, 2026
- ✅ Analyzed current Analytics page
- ✅ Identified all fake data and missing features
- ✅ Created comprehensive TODO list
- ✅ **Backend Implementation (Priority 1)**
  - ✅ Created `getAnalytics()` controller method (307 lines)
  - ✅ Added `/api/admin/analytics` route
  - ✅ Implemented all 6 data queries:
    - User Progression (weekly enrollment/completion trends)
    - Skill Proficiency (quiz scores by course)
    - Engagement Metrics (sessions and estimated time)
    - Knowledge Retention (quiz retake performance)
    - Top Performing Users (top 10 by completion)
    - Lab Analytics (by lab type with scores)
  - ✅ Date range filtering (7/30/90 days, year)
  - ✅ TypeScript compilation successful
- ✅ **Frontend Implementation (Priority 1)**
  - ✅ Added 7 TypeScript interfaces for analytics data
  - ✅ Removed ALL fake/mock data (8 datasets deleted)
  - ✅ Connected all 5 charts to real API data
  - ✅ Added empty state messages
  - ✅ Filters trigger API re-fetch automatically
- ✅ **Testing Complete**
  - ✅ All charts display real data correctly
  - ✅ Date range filter works
  - ✅ Top users table shows actual users
  - ✅ No console errors
- 🎯 **Priority 1: COMPLETE** ✅

**Next Options:**
- Priority 2: Report type filter views (already functional, could add different layouts)
- Priority 3: Export functionality (CSV/PDF)
- Priority 4: Add lab analytics display, course breakdown, question analysis
- Priority 5: UI/UX improvements

---

**Last Review:** January 25, 2026
**Next Decision:** Choose next priority to work on
