# Content Management Page Audit Report

**Date**: March 14, 2026
**Scope**: Admin content management page and related edit pages

---

## Tabs Overview

The admin content page has 6 tabs:

| Tab | Create | Read | Update | Delete | Extra |
|-----|--------|------|--------|--------|-------|
| Courses | In-dialog | Grid view | In-dialog | Yes | Publish/Unpublish |
| Modules | In-dialog | List per course | In-dialog | Yes | Drag reorder |
| Lessons | In-dialog | List per course | Separate page | Yes | Drag reorder |
| Quizzes | Separate page | Card grid | Separate page | Yes | Search + filter |
| Labs | Separate page | Card grid | Separate page | Yes | Search + filter |
| Phishing | Separate page | Card grid | Separate page | Yes | Search + filter |

---

## Issues Found

### High Priority

#### 1. Duplicate/Dead Modules Tab Placeholder
**File**: `admin-content.tsx` (~line 2875)
**What's wrong**: There's a second "Modules" TabsContent near the bottom of the file that's a leftover placeholder saying "coming soon". The real modules tab works fine higher up in the file. This dead code is confusing.
**Fix**: Remove the duplicate placeholder.

#### 2. Lab Edit Preview Tab Is a Placeholder
**File**: `admin-lab-edit.tsx`
**What's wrong**: The "Preview" tab just shows "Preview available after saving" with no actual preview. Admins can't see what students will see before saving.
**Fix**: Show a read-only preview of the lab content and simulation config.

#### 3. Default Lab Configs Fail Validation
**File**: `admin-lab-edit.tsx`
**What's wrong**: When creating a new lab, the default simulation config has empty arrays (e.g., `emails: []`, `links: []`), but the save validation requires at least 2-3 items. So new labs always fail on first save attempt.
**Fix**: Either provide sample starter data in defaults, or skip validation on empty configs.

### Medium Priority

#### 4. Course Delete Uses Unstyled window.confirm()
**File**: `admin-content.tsx` (~line 629)
**What's wrong**: Course deletion uses the browser's native `window.confirm()` dialog, while every other tab uses styled AlertDialog components. It looks inconsistent and jarring.
**Fix**: Replace with AlertDialog matching the pattern used by lessons, quizzes, labs, and phishing.

#### 5. No Search/Filter on Courses Tab
**File**: `admin-content.tsx`
**What's wrong**: Quizzes, Labs, and Phishing tabs all have search bars and filters. The Courses tab has none. With many courses, it's hard to find what you need.
**Fix**: Add search by title and filter by difficulty/published status.

#### 6. Sidebar Margin Not Responsive
**Files**: `admin-lesson-edit.tsx`, `admin-lab-edit.tsx`
**What's wrong**: The main content area uses hardcoded `ml-64` for sidebar spacing. On mobile or tablet screens, the sidebar overlaps the content.
**Fix**: Use responsive classes like `ml-0 md:ml-64`.

#### 7. Phishing Edit Preview Uses dangerouslySetInnerHTML
**File**: `admin-phishing-edit.tsx` (~line 590)
**What's wrong**: The email body preview renders HTML directly without sanitization beyond what the rich text editor provides.
**Fix**: Add DOMPurify sanitization before rendering.

#### 8. Phishing Attempts Not Paginated
**File**: `admin-content.tsx` (~line 1175)
**What's wrong**: Only 20 phishing attempts are loaded with no "load more" or pagination. If a scenario has hundreds of attempts, admins can only see the first 20.
**Fix**: Add pagination or a "Load More" button.

### Low Priority

#### 9. No Loading Indicator on Phishing Edit Retry
**File**: `admin-phishing-edit.tsx`
**What's wrong**: When the error card shows and the user clicks "Try Again", there's no loading spinner — the button just sits there until the fetch completes or fails again.
**Fix**: Set loading state when retry is clicked.

#### 10. Inconsistent Error Message Formats
**File**: `admin-content.tsx`
**What's wrong**: Some error messages say "Failed to load X. Please try again." while others just say "Failed to load X". Minor but noticeable.
**Fix**: Standardize all error messages to the same format.

#### 11. No Bulk Actions
**File**: `admin-content.tsx`
**What's wrong**: No way to select multiple items and delete/publish them at once. Each item must be managed individually.
**Fix**: Add checkboxes and bulk action buttons (delete, publish/unpublish).

---

## Fix Priority Order

1. Remove duplicate modules tab placeholder
2. Replace window.confirm with AlertDialog for course deletion
3. Add search/filter to courses tab
4. Fix default lab config validation
5. Fix responsive sidebar margin
6. Add DOMPurify to phishing preview
7. Add loading indicator on phishing edit retry
8. Standardize error messages
9. Add phishing attempts pagination
10. Lab edit preview (larger effort)
11. Bulk actions (larger effort)
