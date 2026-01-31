# Phishing Simulation Integration Plan

> **Created:** January 31, 2026
> **Status:** Planning
> **Priority:** High

---

## Overview

Integrate a standalone phishing simulation feature into CyberGuard AI that allows students to practice identifying phishing emails, tracks their performance, and provides admin visibility into results.

---

## Todo List

### Phase 1: Database Schema & Backend Setup

- [ ] **1.1** Add `PhishingScenario` model to Prisma schema
  - Fields: title, difficulty, category, emailSubject, emailFrom, emailBody, hasAttachment, attachmentName, hasLink, linkUrl, linkDisplayText, redFlags[], isPhishing, explanation, isActive

- [ ] **1.2** Add `PhishingAttempt` model to Prisma schema
  - Fields: userId, scenarioId, action (clicked/reported/ignored/deleted), isCorrect, timeToDecision, attemptedAt
  - Relations: User, PhishingScenario

- [ ] **1.3** Add `phishingAttempts` relation to User model

- [ ] **1.4** Run `prisma db push` to sync schema

- [ ] **1.5** Create seed data with 15-20 phishing scenarios (mix of difficulties and categories)

---

### Phase 2: Backend API Endpoints

- [ ] **2.1** Create `src/routes/simulation.routes.ts`

- [ ] **2.2** Create `src/controllers/simulation.controller.ts`

- [ ] **2.3** Implement student endpoints:
  - `GET /api/simulations/phishing/scenario` - Get random scenario (weighted by difficulty/unseen)
  - `POST /api/simulations/phishing/submit` - Submit attempt and get result
  - `GET /api/simulations/phishing/stats` - Get user's phishing stats

- [ ] **2.4** Implement admin endpoints:
  - `GET /api/admin/simulations/phishing/scenarios` - List all scenarios
  - `GET /api/admin/simulations/phishing/scenarios/:id` - Get single scenario
  - `POST /api/admin/simulations/phishing/scenarios` - Create scenario
  - `PUT /api/admin/simulations/phishing/scenarios/:id` - Update scenario
  - `DELETE /api/admin/simulations/phishing/scenarios/:id` - Delete scenario
  - `GET /api/admin/simulations/phishing/results` - Get all user results with filters

- [ ] **2.5** Register routes in `src/index.ts`

---

### Phase 3: Frontend - Student Simulation Page

- [ ] **3.1** Create `src/app/components/phishing-simulation.tsx`
  - Email display component (realistic Gmail-style UI)
  - Action buttons (Ignore, Click Link, Delete, Report as Phishing)
  - Timer tracking for decision time
  - Result display with explanation
  - Red flags reveal after answering
  - Stats display (click rate, report rate, total attempts, accuracy)

- [ ] **3.2** Create `src/app/services/simulation.service.ts`
  - API calls for fetching scenarios, submitting attempts, getting stats

- [ ] **3.3** Add page type to App.tsx router
  - Add 'phishing-simulation' to Page type
  - Add navigation handler
  - Render PhishingSimulation component

---

### Phase 4: Frontend - Student Dashboard Integration

- [ ] **4.1** Update `student-dashboard.tsx`
  - Add "Simulations" tab to the dashboard
  - Create simulation card with stats preview
  - "Start Simulation" button navigates to phishing-simulation page

- [ ] **4.2** Add phishing stats to dashboard overview
  - Show click rate trend
  - Show recent simulation activity

---

### Phase 5: Frontend - Admin Management

- [ ] **5.1** Create `src/app/components/admin-phishing-scenarios.tsx`
  - List all scenarios with search/filter
  - Create/Edit scenario modal or dedicated page
  - Preview scenario as student would see it
  - Toggle active/inactive status
  - Delete with confirmation

- [ ] **5.2** Create `src/app/components/admin-phishing-results.tsx`
  - View all user attempts
  - Filter by user, scenario, date range, correctness
  - Aggregate stats (platform-wide click rate, most failed scenarios)
  - Export to CSV

- [ ] **5.3** Update `admin-content.tsx` or create new admin tab
  - Add "Simulations" section to admin navigation
  - Link to scenarios management and results viewing

---

### Phase 6: Testing & Polish

- [ ] **6.1** Test full student flow
  - Load scenario → take action → see result → view stats → repeat

- [ ] **6.2** Test admin flow
  - Create scenario → edit → preview → view results

- [ ] **6.3** Test edge cases
  - No scenarios available
  - User has completed all scenarios
  - Network errors during submission

- [ ] **6.4** Mobile responsiveness
  - Ensure simulation works well on smaller screens

- [ ] **6.5** Dark mode compatibility
  - Verify all new components support dark mode

---

## Technical Decisions to Make

1. **Scenario Selection Algorithm**
   - Random? Weighted by difficulty? Prioritize unseen scenarios?
   - Adaptive based on user performance?

2. **Stats Calculation**
   - Real-time calculation vs cached/aggregated?
   - How far back to look for "recent" stats?

3. **Scenario Categories**
   - Which categories to support initially?
   - Suggested: `general`, `spear-phishing`, `whaling`, `credential-harvesting`, `malware-delivery`

4. **Difficulty Levels**
   - Match existing course difficulties: Beginner, Intermediate, Advanced?

5. **Admin Scenario Editor**
   - Rich text for email body or plain text?
   - Preview functionality?

---

## File Structure (New Files)

```
backend/
├── src/
│   ├── controllers/
│   │   └── simulation.controller.ts    # NEW
│   └── routes/
│       └── simulation.routes.ts        # NEW
└── prisma/
    └── schema.prisma                   # MODIFIED (add models)

frontend/
└── src/app/
    ├── components/
    │   ├── phishing-simulation.tsx         # NEW - Student simulation page
    │   ├── admin-phishing-scenarios.tsx    # NEW - Admin scenario management
    │   └── admin-phishing-results.tsx      # NEW - Admin results view
    ├── services/
    │   └── simulation.service.ts           # NEW - API service
    └── App.tsx                             # MODIFIED (add route)
```

---

## Scenario Data Structure

```typescript
interface PhishingScenario {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'general' | 'spear-phishing' | 'whaling' | 'credential-harvesting' | 'malware-delivery';
  emailSubject: string;
  emailFrom: string;
  emailBody: string;           // HTML content
  hasAttachment: boolean;
  attachmentName?: string;
  hasLink: boolean;
  linkUrl?: string;            // The actual (suspicious) URL
  linkDisplayText?: string;    // What the link text shows
  redFlags: string[];          // Array of red flag descriptions
  isPhishing: boolean;
  explanation: string;         // Shown after user answers
  isActive: boolean;
}
```

---

## Success Criteria

- [ ] Students can access phishing simulation from dashboard
- [ ] Simulation presents realistic email scenarios
- [ ] User actions are tracked and stored in database
- [ ] Stats are calculated and displayed accurately
- [ ] Admin can create, edit, and delete scenarios
- [ ] Admin can view all user results and aggregate stats
- [ ] All features work in both light and dark mode
- [ ] Mobile-friendly UI

---

## Estimated Scope

| Phase | Complexity | Files Affected |
|-------|------------|----------------|
| Phase 1 | Low | 1 (schema.prisma) |
| Phase 2 | Medium | 3 (routes, controller, index) |
| Phase 3 | High | 3 (component, service, App.tsx) |
| Phase 4 | Medium | 1 (student-dashboard.tsx) |
| Phase 5 | High | 3 (admin components) |
| Phase 6 | Low | Testing only |

---

## Notes

- This integrates alongside the existing Labs system (which has PHISHING_EMAIL type) but provides a more focused, standalone simulation experience
- The existing lab system is course-bound; this simulation is accessible anytime from dashboard
- Consider future expansion: SMS phishing, voice phishing, social engineering scenarios
