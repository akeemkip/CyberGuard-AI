# Platform Settings TODO

> **Last Updated:** January 26, 2026
> **Component:** Admin Settings Page (`frontend/src/app/components/admin-settings.tsx`)
> **Status:** 0/22 Complete

---

## Overview

This document tracks all identified issues, missing features, and improvements needed for the Platform Settings page. Items are organized by priority and category for systematic implementation.

---

## 🔴 Critical Issues (High Priority)

### 1. Settings Don't Persist on Page Load
- **Status:** ❌ Not Started
- **Problem:** Settings are saved to localStorage but never loaded back when the page loads
- **Impact:** Every time you refresh, all settings reset to defaults
- **Location:** `admin-settings.tsx` lines 92-133 (initialization) vs Line 169 (save)
- **Fix:**
  ```typescript
  useEffect(() => {
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);
  ```
- **Estimated Effort:** 15 minutes
- **Dependencies:** None

### 2. Missing SMTP Password Field
- **Status:** ❌ Not Started
- **Problem:** SMTP configuration has Host, Port, and User but no password field
- **Impact:** Can't actually configure email sending functionality
- **Location:** Email tab (lines 640-669)
- **Fix:** Add password input field with type="password"
- **Estimated Effort:** 10 minutes
- **Dependencies:** None

### 3. Settings Don't Actually Apply
- **Status:** ❌ Not Started
- **Problem:** Settings are saved but don't affect the platform behavior
- **Non-functional Settings:**
  - Primary color doesn't change theme colors
  - Logo/Favicon URLs don't update the actual logo/favicon
  - Custom CSS isn't injected into the page
  - Min password length not enforced on registration
  - Default quiz passing score not used in quiz creation
  - Session timeout not enforced
  - Max login attempts not tracked
- **Impact:** Settings page is essentially decorative
- **Fix:** Need to implement settings application throughout the app
- **Estimated Effort:** 4-6 hours
- **Dependencies:** Backend integration, global state management

---

## 🟠 High Priority Features

### 4. Backend Integration
- **Status:** ❌ Not Started
- **Problem:** Settings only save to localStorage (not persistent across browsers/devices)
- **Tasks:**
  - [ ] Create `PlatformSettings` database model in Prisma schema
  - [ ] Add GET `/api/admin/settings` endpoint
  - [ ] Add PUT `/api/admin/settings` endpoint
  - [ ] Migrate from localStorage to API calls
  - [ ] Add settings migration for existing deployments
- **Estimated Effort:** 3-4 hours
- **Dependencies:** Database migration

### 5. Input Validation
- **Status:** ❌ Not Started
- **Problem:** No validation on user inputs
- **Missing Validations:**
  - Email fields don't validate format
  - Color picker doesn't validate hex codes
  - URLs not validated
  - Number inputs can accept out-of-range values
  - SMTP port must be 1-65535
- **Fix:** Add validation logic with error messages
- **Estimated Effort:** 2 hours
- **Dependencies:** None

### 6. Apply Settings Dynamically
- **Status:** ❌ Not Started
- **Problem:** Saved settings don't affect the platform
- **Implementation Areas:**
  - **Primary Color:** Inject CSS variables dynamically
  - **Logo/Favicon:** Update document head dynamically
  - **Custom CSS:** Inject style tag into document
  - **Platform Name:** Update throughout app (header, title, etc.)
  - **Min Password Length:** Enforce in registration validation
  - **Session Timeout:** Implement JWT expiration based on setting
  - **Default Passing Score:** Use when creating new quizzes
- **Estimated Effort:** 5-6 hours
- **Dependencies:** Settings persistence, backend integration

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
- **Status:** ❌ Not Started
- **Problem:** No way to preview changes before saving
- **Features Needed:**
  - [ ] Primary color preview (show sample buttons, badges)
  - [ ] Logo preview (thumbnail when URL entered)
  - [ ] Favicon preview
  - [ ] Custom CSS preview mode (toggle on/off)
  - [ ] Platform name preview in header
- **Estimated Effort:** 3 hours
- **Dependencies:** None

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

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix settings persistence (#1)
- [ ] Add SMTP password field (#2)
- [ ] Add input validation (#5)
- [ ] Add settings preview (#8)

### Phase 2: Backend Integration (Week 2)
- [ ] Create backend API (#4)
- [ ] Apply settings dynamically (#6)
- [ ] Implement settings security (#9)

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

- [ ] Settings persist on page refresh
- [ ] Settings persist after logout/login
- [ ] Settings sync across browser tabs
- [ ] Invalid inputs show error messages
- [ ] SMTP test email works
- [ ] Primary color changes apply to theme
- [ ] Logo/favicon updates work
- [ ] Custom CSS applies correctly
- [ ] Password length enforced on registration
- [ ] Session timeout works as configured
- [ ] Export/import settings works
- [ ] Factory reset works
- [ ] Audit log tracks all changes
- [ ] Settings accessible only to admins
- [ ] Mobile responsive on all tabs

---

## Notes

- Settings currently stored in localStorage (lines 169, 183)
- No backend API endpoints exist for settings
- No database model for PlatformSettings
- Many settings are cosmetic (don't affect behavior)
- SMTP configuration incomplete (missing password, SSL/TLS options)
- No email service implementation in backend

---

**End of Document**
