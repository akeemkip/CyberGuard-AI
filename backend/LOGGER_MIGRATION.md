# Console.log to Logger Migration Guide

## Status
- ✅ Critical files migrated (auth, middleware, index, upload)
- 🟡 ~90 occurrences remaining across 10 controller files
- Pattern established for systematic migration

## Completed Migrations
1. ✅ `src/middleware/auth.middleware.ts` - 1 occurrence
2. ✅ `src/index.ts` - 3 occurrences
3. ✅ `src/controllers/auth.controller.ts` - 5 occurrences
4. ✅ `src/controllers/upload.controller.ts` - 2 occurrences

## Remaining Files (by priority)
1. `src/controllers/admin.controller.ts` - 31 occurrences
2. `src/controllers/course.controller.ts` - 22 occurrences
3. `src/controllers/user.controller.ts` - 10 occurrences
4. `src/controllers/settings.controller.ts` - 7 occurrences
5. `src/controllers/assessment.controller.ts` - 6 occurrences
6. `src/controllers/phishing.controller.ts` - 4 occurrences
7. `src/services/email.service.ts` - 2 occurrences
8. `src/services/ai.service.ts` - 2 occurrences
9. `src/controllers/ai.controller.ts` - 1 occurrence
10. `src/services/smart-chatbot.service.ts` - 1 occurrence

## Migration Pattern

### Step 1: Add logger import
```typescript
// Add this import at the top of the file
import { logger } from '../utils/logger';
// or for services:
import { logger } from './utils/logger';
```

### Step 2: Replace console statements

**Replace console.error:**
```typescript
// Before
console.error('Error message', error);

// After
logger.error('Error message', { error: error.message, stack: error.stack });
// or simply
logger.error('Error message', error);
```

**Replace console.log:**
```typescript
// Before
console.log('Info message', data);

// After
logger.info('Info message', data);
```

**Replace console.warn:**
```typescript
// Before
console.warn('Warning message');

// After
logger.warn('Warning message');
```

**Replace console.debug:**
```typescript
// Before
console.debug('Debug info', details);

// After
logger.debug('Debug info', details);
```

## Quick Migration Script

You can use this Node.js script to help automate the migration:

```javascript
// migrate-logger.js
const fs = require('fs');
const path = require('path');

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if logger is already imported
  if (!content.includes("import { logger } from")) {
    // Find the last import statement
    const importMatch = content.match(/^import .+ from .+;$/gm);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      const importLine = filePath.includes('/services/')
        ? "import { logger } from './utils/logger';"
        : "import { logger } from '../utils/logger';";

      content = content.replace(lastImport, lastImport + '\n' + importLine);
    }
  }

  // Replace console statements
  content = content.replace(/console\.error/g, 'logger.error');
  content = content.replace(/console\.warn/g, 'logger.warn');
  content = content.replace(/console\.log/g, 'logger.info');
  content = content.replace(/console\.debug/g, 'logger.debug');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Migrated: ${filePath}`);
}

// Usage:
// node migrate-logger.js src/controllers/admin.controller.ts
const targetFile = process.argv[2];
if (targetFile) {
  migrateFile(targetFile);
} else {
  console.log('Usage: node migrate-logger.js <file-path>');
}
```

## Manual Migration (Recommended)

For better control and to handle edge cases:

1. Open the target file
2. Add logger import at the top
3. Find all `console.error` → Replace with `logger.error`
4. Find all `console.warn` → Replace with `logger.warn`
5. Find all `console.log` → Replace with `logger.info`
6. Find all `console.debug` → Replace with `logger.debug`
7. Review changes to ensure no breaking changes
8. Test the file

## Benefits of Logger

✅ **Production Safety**: Only errors and warnings logged in production
✅ **Structured Logging**: Consistent format with timestamps and log levels
✅ **External Service Ready**: Easy integration with Sentry, LogRocket, CloudWatch
✅ **Performance**: Reduced noise in production environments
✅ **Debugging**: Better log level control for development

## Testing After Migration

After migrating a file:

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test the affected endpoints** to ensure logging works

3. **Check log output format:**
   ```
   [2026-02-01T12:34:56.789Z] [ERROR] Error message { error: '...' }
   [2026-02-01T12:34:56.790Z] [INFO] Info message
   ```

## Future Enhancements

Once migration is complete:

1. **Add external logging service** (edit `src/utils/logger.ts` line 25-26)
2. **Add log rotation** for file-based logging
3. **Add structured error reporting** to Sentry or similar
4. **Add performance metrics** logging

## Completion Checklist

- [x] Migrate critical security files (auth, middleware)
- [x] Migrate main application file (index.ts)
- [ ] Migrate all controller files
- [ ] Migrate all service files
- [ ] Remove all `console.*` statements (except in logger.ts itself)
- [ ] Test all endpoints
- [ ] Document logger usage in README
