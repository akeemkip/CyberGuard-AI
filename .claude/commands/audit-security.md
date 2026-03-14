Perform a security audit of the codebase. Check for:

## Backend
1. **SQL Injection**: Any raw SQL queries bypassing Prisma ORM
2. **Auth bypass**: Routes missing `authenticateToken` or `requireAdmin` middleware where needed
3. **CSRF gaps**: Mutation endpoints missing CSRF protection or incorrectly exempted
4. **Input validation**: Endpoints accepting user input without Zod validation
5. **Secrets exposure**: Hardcoded secrets, API keys, or credentials in source files (not .env)
6. **Rate limiting**: Auth-sensitive endpoints without stricter rate limits
7. **Error leakage**: Stack traces or internal details exposed in error responses

## Frontend
1. **XSS**: Dangerous use of `dangerouslySetInnerHTML` without sanitization
2. **Token handling**: JWT stored insecurely or exposed in URLs
3. **Sensitive data**: API keys or secrets in frontend code

## Report Format
For each finding:
- **Severity**: Critical / High / Medium / Low
- **Location**: file:line
- **Issue**: What's wrong
- **Fix**: How to fix it

If no issues found in a category, say so explicitly.
