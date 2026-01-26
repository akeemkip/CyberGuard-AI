# Platform Settings TODO

> **Last Updated:** January 26, 2026
> **Component:** Admin Settings Page (`frontend/src/app/components/admin-settings.tsx`)
> **Status:** 7/22 Complete (32%)

---

## Overview

This document tracks all identified issues, missing features, and improvements needed for the Platform Settings page. Items are organized by priority and category for systematic implementation.

---

## Progress Summary

### Completed (7/22 - 32%)
- ✅ #1: Settings Persistence (cf7a4aa)
- ✅ #2: SMTP Password Field (cf7a4aa)
- ✅ #3: Settings Apply to Platform (0d22cb9)
- ✅ #4: Backend Integration (16b0f41)
- ✅ #5: Input Validation (cf7a4aa)
- ✅ #6: Apply Settings Dynamically (0d22cb9)
- ✅ #8: Preview Functionality (7e43829)

### In Progress
- 🔄 **Phase 2: Backend Integration** (3/3 complete)

### Next Priority
- 🔜 #9: Settings Security Improvements (4 hours)
- 🔜 #7: Test Email Functionality (2 hours)

### By Phase
- **Phase 1:** ✅ Complete (4/4 items)
- **Phase 2:** ✅ Complete (3/3 items)
- **Phase 3:** Not Started (4 items)
- **Phase 4:** Not Started (10 items)

---

## 🔴 Critical Issues (High Priority)

### 1. Settings Don't Persist on Page Load
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Added useEffect to load settings from backend API on mount
- **Commit:** cf7a4aa
- **Result:** Settings now persist on page refresh and load from database

### 2. Missing SMTP Password Field
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Added smtpPassword field to interface, state, and UI with type="password"
- **Commit:** cf7a4aa
- **Result:** SMTP configuration now complete with host, port, username, and password

### 3. Settings Don't Actually Apply
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Created PlatformSettingsContext and updated all components
- **Implemented Settings:**
  - ✅ Primary color changes theme colors (CSS variables)
  - ✅ Logo URL updates with fallback to Shield icon
  - ✅ Favicon URL updates with restore-to-default support
  - ✅ Custom CSS injected into page
  - ✅ Min password length enforced on registration (frontend + backend)
  - ✅ Session timeout enforced via JWT expiration
  - ✅ Platform name updates throughout app
  - ⏳ Default quiz passing score (not yet implemented)
  - ⏳ Max login attempts (not yet implemented)
- **Commit:** 0d22cb9
- **Bonus:** Added file upload for logo/favicon images

---

## 🟠 High Priority Features

### 4. Backend Integration
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Full backend infrastructure implemented
- **Tasks:**
  - [x] Create `PlatformSettings` database model in Prisma schema
  - [x] Add GET `/api/admin/settings` endpoint
  - [x] Add PUT `/api/admin/settings` endpoint
  - [x] Migrate from localStorage to API calls
  - [x] Database table created successfully
- **Commit:** 16b0f41
- **Result:** Settings stored in PostgreSQL, persist across devices/browsers, protected by auth middleware

### 5. Input Validation
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Comprehensive real-time validation system
- **Validations Implemented:**
  - Email format validation (regex)
  - Hex color validation (#RRGGBB format)
  - URL validation (full URL check)
  - Number range validation (password length, timeout, attempts, scores)
  - SMTP port validation (1-65535)
- **UI Features:**
  - Red borders on invalid fields
  - Error messages displayed below inputs
  - Error count in header
  - Save button disabled when errors exist
- **Commit:** cf7a4aa
- **Result:** All 11 validated fields show real-time feedback, prevents saving invalid data

### 6. Apply Settings Dynamically
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Full dynamic settings implementation
- **Implementation Details:**
  - ✅ **Primary Color:** CSS variables (--primary, --ring, --sidebar-primary, --chart-1)
  - ✅ **Logo:** PlatformLogo component with image URL + Shield fallback
  - ✅ **Favicon:** Dynamic update with restore-to-default on clear
  - ✅ **Custom CSS:** Injected via `<style id="platform-custom-css">` tag
  - ✅ **Platform Name:** Document title + all page headers
  - ✅ **Min Password Length:** Backend Zod validation + frontend validation
  - ✅ **Session Timeout:** JWT expiration from DB setting
  - ⏳ **Default Passing Score:** Not yet implemented (use when creating quizzes)
- **Commit:** 0d22cb9
- **Files Created:**
  - `frontend/src/app/context/PlatformSettingsContext.tsx`
  - `frontend/src/app/components/PlatformLogo.tsx`
  - `backend/src/controllers/upload.controller.ts`

---

## 🟡 Medium Priority Features

### 7. Test Email Functionality
- **Status:** ❌ Not Started
- **Problem:** Can't verify SMTP configuration works
- **Tasks:**
  - [ ] Add "Send Test Email" button in Email tab
  - [ ] Create POST `/api/admin/settings/test-email` endpoint
  - [ ] Implement email sending test
  - [ ] Show success/failure notification
  - [ ] Display email delivery status
- **Estimated Effort:** 2 hours
- **Dependencies:** Backend email service

### 8. Preview Functionality
- **Status:** ✅ Complete
- **Completed:** January 26, 2026
- **Solution:** Real-time preview components for all appearance settings
- **Features Implemented:**
  - [x] Primary color preview (buttons, badges, color circle)
  - [x] Logo preview (thumbnail with error handling)
  - [x] Favicon preview (32x32 icon display)
  - [x] Platform name preview (header mockup with Shield icon)
- **Commit:** 7e43829
- **Result:** Live previews update as user types, shows exactly how changes will appear

### 9. Settings Security Improvements
- **Status:** ❌ Not Started
- **Problem:** Sensitive data stored insecurely
- **Issues:**
  - SMTP password stored in localStorage (visible in dev tools)
  - No encryption for sensitive settings
  - Settings accessible to all admins without role checks
- **Fix:**
  - Move sensitive data to backend-only storage
  - Implement settings permission system
  - Add audit log for settings changes
- **Estimated Effort:** 4 hours
- **Dependencies:** Backend integration

### 10. Settings Import/Export
- **Status:** ❌ Not Started
- **Problem:** Can't backup or transfer settings
- **Features:**
  - [ ] Export settings to JSON file
  - [ ] Import settings from JSON file
  - [ ] Validate imported settings structure
  - [ ] Backup settings before import
  - [ ] Export/import confirmation dialogs
- **Estimated Effort:** 2 hours
- **Dependencies:** None

---

## 🟢 Low Priority Enhancements

### 11. Reset to Factory Defaults
- **Status:** ❌ Not Started
- **Problem:** No way to reset all settings to original defaults
- **Features:**
  - [ ] "Reset to Factory Defaults" button
  - [ ] Confirmation dialog with warning
  - [ ] Preserve non-resettable settings (API keys, etc.)
  - [ ] Show diff of what will be reset
- **Estimated Effort:** 1 hour
- **Dependencies:** None

### 12. Settings History/Audit Log
- **Status:** ❌ Not Started
- **Problem:** Can't track who changed what and when
- **Features:**
  - [ ] Database table for settings history
  - [ ] Track: timestamp, user, field changed, old value, new value
  - [ ] Settings history viewer UI
  - [ ] Rollback capability
  - [ ] Export audit log
- **Estimated Effort:** 4 hours
- **Dependencies:** Backend integration, database schema

### 13. Extended Email Options
- **Status:** ❌ Not Started
- **Problem:** Limited email notification configuration
- **Missing Features:**
  - Push notifications toggle
  - SMS notifications (Twilio integration)
  - Email template customization
  - Email scheduling options
  - Notification frequency limits
  - Digest schedule configuration (not just weekly)
- **Estimated Effort:** 6 hours
- **Dependencies:** External services (Twilio, etc.)

### 14. Extended Appearance Customization
- **Status:** ❌ Not Started
- **Problem:** Limited branding options
- **Missing Features:**
  - Secondary color picker
  - Accent color picker
  - Font family selector (Google Fonts integration)
  - Font size scaling (compact/normal/large)
  - Theme presets (pre-configured color schemes)
  - Dark mode default toggle
  - Layout density options
  - Border radius customization
- **Estimated Effort:** 5 hours
- **Dependencies:** Theme system refactor

### 15. Search Settings
- **Status:** ❌ Not Started
- **Problem:** Hard to find specific settings in 6 tabs
- **Features:**
  - [ ] Search bar above tabs
  - [ ] Search by setting name, description, or keyword
  - [ ] Highlight matching settings
  - [ ] Jump to setting's tab
- **Estimated Effort:** 2 hours
- **Dependencies:** None

### 16. Settings Presets
- **Status:** ❌ Not Started
- **Problem:** Common configurations require manual setup
- **Features:**
  - [ ] Preset configurations (Strict Security, Open Platform, etc.)
  - [ ] Apply preset with one click
  - [ ] Save custom presets
  - [ ] Share presets with other admins
- **Estimated Effort:** 3 hours
- **Dependencies:** Settings persistence

### 17. Settings Tooltips/Help
- **Status:** ❌ Not Started
- **Problem:** Some settings need more explanation
- **Features:**
  - [ ] Info icons with detailed tooltips
  - [ ] Link to documentation for complex settings
  - [ ] "Learn more" links
  - [ ] Warning tooltips for dangerous settings
- **Estimated Effort:** 2 hours
- **Dependencies:** Documentation

### 18. Conditional Settings Display
- **Status:** ❌ Not Started
- **Problem:** Some settings only relevant when others are enabled
- **Features:**
  - [ ] Hide SMTP config when email notifications disabled
  - [ ] Show warnings when related settings conflict
  - [ ] Group dependent settings visually
  - [ ] Smart defaults based on other settings
- **Estimated Effort:** 2 hours
- **Dependencies:** None

### 19. Settings Validation Rules
- **Status:** ❌ Not Started
- **Problem:** No business logic validation
- **Examples:**
  - Min password length should be at least 6 for security
  - Session timeout should have reasonable range
  - SMTP port should be valid port number
  - Email addresses must be valid format
  - URLs must be valid and accessible
- **Estimated Effort:** 2 hours
- **Dependencies:** Validation library (Zod)

### 20. Multi-Language Support
- **Status:** ❌ Not Started
- **Problem:** Settings UI only in English
- **Features:**
  - [ ] Default language setting
  - [ ] Translate settings labels/descriptions
  - [ ] Support for RTL languages
  - [ ] Language-specific defaults
- **Estimated Effort:** 4 hours
- **Dependencies:** i18n library

### 21. Settings Permissions
- **Status:** ❌ Not Started
- **Problem:** All admins have full settings access
- **Features:**
  - [ ] Granular permissions per settings category
  - [ ] Read-only admin role
  - [ ] Settings admin role (non-superadmin)
  - [ ] Permission-based UI hiding
- **Estimated Effort:** 3 hours
- **Dependencies:** Permission system

### 22. Settings Monitoring
- **Status:** ❌ Not Started
- **Problem:** No visibility into settings effectiveness
- **Features:**
  - [ ] Track when settings were last changed
  - [ ] Monitor impact of settings (e.g., login success rate after max attempts change)
  - [ ] Settings health check (e.g., SMTP connection test)
  - [ ] Recommendations based on usage patterns
- **Estimated Effort:** 4 hours
- **Dependencies:** Analytics system

---

## ✅ Working Features

These features are currently functioning correctly:

1. ✅ Tab navigation and persistence
2. ✅ Unsaved changes warning
3. ✅ Reset button (resets to last saved state)
4. ✅ Clean, organized UI with 6 tabs
5. ✅ Descriptive labels and help text
6. ✅ Disabled states for dependent settings (email notifications)
7. ✅ Responsive layout
8. ✅ Theme toggle (light/dark mode)
9. ✅ Save/loading states with spinner
10. ✅ Toast notifications for save success/failure

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1) ✅ COMPLETE
- [x] Fix settings persistence (#1) ✅
- [x] Add SMTP password field (#2) ✅
- [x] Add input validation (#5) ✅
- [x] Add settings preview (#8) ✅

### Phase 2: Backend Integration (Week 2) ✅ COMPLETE
- [x] Create backend API (#4) ✅
- [x] Apply settings dynamically (#6) ✅
- [ ] Implement settings security (#9) ⏳ NEXT

### Phase 3: Enhanced Features (Week 3)
- [ ] Test email functionality (#7)
- [ ] Import/export settings (#10)
- [ ] Factory reset (#11)
- [ ] Search settings (#15)

### Phase 4: Advanced Features (Week 4+)
- [ ] Settings audit log (#12)
- [ ] Extended customization (#13, #14)
- [ ] Settings presets (#16)
- [ ] Permissions & monitoring (#21, #22)

---

## Testing Checklist

After implementing fixes, verify:

- [x] Settings persist on page refresh ✅
- [x] Settings persist after logout/login ✅
- [x] Settings sync across browser tabs ✅
- [x] Invalid inputs show error messages ✅
- [ ] SMTP test email works
- [x] Primary color changes apply to theme ✅
- [x] Logo/favicon updates work ✅
- [x] Custom CSS applies correctly ✅
- [x] Password length enforced on registration ✅
- [x] Session timeout works as configured ✅
- [ ] Export/import settings works
- [ ] Factory reset works
- [ ] Audit log tracks all changes
- [x] Settings accessible only to admins ✅
- [x] Mobile responsive on all tabs ✅

---

## Notes

### Current State (January 26, 2026)
- ✅ Settings stored in PostgreSQL database via PlatformSettings model
- ✅ Backend API endpoints exist: GET/PUT /api/admin/settings
- ✅ Public settings endpoint: GET /api/settings/public (no auth)
- ✅ Frontend integrated with backend API (no more localStorage)
- ✅ SMTP configuration complete (host, port, user, password)
- ✅ Input validation working for all fields
- ✅ Preview functionality showing real-time changes
- ✅ Settings apply dynamically (colors, logo, favicon, CSS, platform name)
- ✅ File upload for logo/favicon with local storage
- ✅ Password validation uses DB minPasswordLength
- ✅ JWT expiration uses DB sessionTimeout
- 🔜 Next: Test email functionality, settings security

### Technical Debt
- SMTP password stored in database (consider encryption for #9)
- No email service implementation yet
- No settings audit log
- Default quiz passing score not yet used
- Max login attempts not yet tracked

---

**End of Document**
