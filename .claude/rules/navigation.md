# Frontend Custom Routing System

This project does NOT use React Router. All routing is state-based in `frontend/src/app/App.tsx`.

## How it works
- `currentPage` state holds the active page name (a union type of ~30 string literals)
- `renderPage()` is a switch statement that returns the correct component
- `handleNavigate(page, idParam?)` updates state + pushes to browser history
- `AnimatePresence` wraps `renderPage()` with fade transitions (keyed on `currentPage`)

## Page categories
- **protectedPages**: require auth (student + admin pages)
- **guestPages**: visible to unauthenticated users (landing, login, register, etc.)
- **adminOnlyPages**: ADMIN role required, students silently blocked
- **studentOnlyPages**: STUDENT role required, admins silently blocked
- **transientPages**: require an `idParam`, NOT persisted to localStorage (course-player, lab-player, admin-*-edit)

## Adding a new page
1. Add to the `Page` union type
2. Add to the correct access array(s) (protectedPages, adminOnlyPages/studentOnlyPages)
3. If it takes an ID param: add to `transientPages` + `transientPageParents` mapping
4. Add the case in `renderPage()` switch
5. Add ID state variable + localStorage persistence if transient

## Gotchas
- Transient pages get their parent pushed to history first via `replaceState`, so back button works correctly
- ID params are stored in BOTH React state AND localStorage — both must be set
- All transient pages have null-ID guards in `renderPage()` — if the ID is missing, the parent page renders instead
- localStorage IDs are validated on load via `readStoredId()` — rejects empty, "undefined", "null" values
- Admin users CANNOT access any student pages and vice versa — no shared pages exist
- The initial page is resolved from: history.state → localStorage → "landing" (transient pages in localStorage are skipped)
- Logout has an 800ms delay for toast visibility before redirect
