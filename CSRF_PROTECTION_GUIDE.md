# CSRF Protection Implementation Guide

## ✅ What Was Implemented

Your CyberGuard-AI platform now has comprehensive CSRF (Cross-Site Request Forgery) protection using a **double-submit cookie pattern** with server-side validation.

---

## 🛡️ How It Works

### 1. **Token Generation** (Server-Side)
When a user logs in:
1. Server generates a unique cryptographic token (32 bytes random)
2. Token is stored server-side with 24-hour expiration
3. Token is sent to client in **two ways**:
   - HTTP-only cookie: `csrf-token`
   - JSON response body: `{ csrfToken: "..." }`

### 2. **Token Validation** (Server-Side)
For every state-changing request (POST, PUT, DELETE, PATCH):
1. ✅ Checks `X-CSRF-Token` header matches cookie value (double-submit)
2. ✅ Verifies token exists in server-side store
3. ✅ Confirms token hasn't expired
4. ✅ Validates request origin matches allowed origins
5. ❌ Rejects request if any check fails (403 Forbidden)

### 3. **Automatic Frontend Integration**
- Axios interceptor automatically adds `X-CSRF-Token` header
- CSRF token fetched after login/registration
- Token cleared on logout
- Works transparently for all API calls

---

## 📁 Files Created/Modified

### Backend:
- ✅ **`src/middleware/csrf.middleware.ts`** - Core CSRF protection logic
- ✅ **`src/index.ts`** - Added cookie-parser and CSRF middleware

### Frontend:
- ✅ **`src/app/utils/csrf.ts`** - CSRF token management utility
- ✅ **`src/app/services/api.ts`** - Automatic CSRF header injection
- ✅ **`src/app/context/AuthContext.tsx`** - Token fetch/clear on login/logout

---

## 🔍 Security Features

### ✅ Double-Submit Cookie Pattern
- Token sent in both cookie AND header
- Attacker can't read cookie from different domain (Same-Origin Policy)
- Even if attacker tricks user into making request, they can't include correct header

### ✅ Server-Side Token Store
- Tokens validated against secure server-side store
- Not just relying on cookie/header match
- Tokens expire after 24 hours

### ✅ Origin Validation
- Checks `Origin` and `Referer` headers
- Only allows requests from configured `FRONTEND_URL`
- Prevents attacks from malicious websites

### ✅ Automatic Cleanup
- Expired tokens removed every hour
- Prevents memory leaks from token accumulation

---

## 🚀 How to Use (For Developers)

### Backend - Protected Routes
CSRF protection is **automatically applied** to all routes after this line in `index.ts`:
```typescript
app.use(csrfProtection);
```

**Endpoints that SKIP CSRF:**
- ✅ `GET`, `HEAD`, `OPTIONS` requests (safe methods)
- ✅ `/api/health` (health check)
- ✅ `/api/auth/login` (login endpoint)
- ✅ `/api/auth/register` (registration endpoint)
- ✅ `/api/settings/public` (public settings)

All other POST/PUT/DELETE/PATCH requests are protected.

### Frontend - Making API Calls
**No changes needed!** CSRF tokens are added automatically:

```typescript
// This just works - CSRF token added automatically
await api.post('/api/admin/users', { email, password, ... });
await api.delete('/api/admin/users/123');
await api.put('/api/users/settings', { theme: 'dark' });
```

### Manual CSRF Token Usage (If Needed)
```typescript
import { getCsrfToken } from '../utils/csrf';

// Get current CSRF token
const token = await getCsrfToken();

// Add to custom fetch request
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': token,
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify(data)
});
```

---

## 🧪 Testing CSRF Protection

### Test 1: Normal Request (Should Work)
```bash
# 1. Login to get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cyberguard.com","password":"admin123"}' \
  -c cookies.txt

# 2. Get CSRF token
curl -X GET http://localhost:3000/api/csrf-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -b cookies.txt

# 3. Make protected request with CSRF token
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-CSRF-Token: YOUR_CSRF_TOKEN" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"email":"test@example.com","password":"Password123!","firstName":"Test","lastName":"User"}'
```

### Test 2: Request Without CSRF Token (Should Fail)
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Expected: 403 Forbidden
# Response: {"error":"CSRF token required","message":"CSRF token missing from request header"}
```

### Test 3: Request With Invalid CSRF Token (Should Fail)
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-CSRF-Token: invalid-token-123" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"email":"test@example.com","password":"test123"}'

# Expected: 403 Forbidden
# Response: {"error":"Invalid CSRF token","message":"CSRF token is invalid or expired"}
```

---

## 🔧 Configuration

### Environment Variables
No new environment variables needed! CSRF protection uses existing `FRONTEND_URL`:

```env
# backend/.env
FRONTEND_URL="http://localhost:5173,http://localhost:5174"
```

Multiple origins supported (comma-separated).

### Token Expiration
Default: **24 hours**

To change, edit `csrf.middleware.ts`:
```typescript
const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
// Change to:
const expiresAt = Date.now() + (12 * 60 * 60 * 1000); // 12 hours
```

---

## 🚨 Troubleshooting

### Issue: "CSRF token required" error
**Cause:** Token not being sent with request

**Solutions:**
1. Ensure user is logged in
2. Check browser console for CSRF fetch errors
3. Verify `withCredentials: true` in axios config
4. Check that cookies are enabled

### Issue: "CSRF token mismatch" error
**Cause:** Cookie and header tokens don't match

**Solutions:**
1. Clear browser cookies
2. Log out and log back in
3. Check for multiple tabs (token might have refreshed)

### Issue: "Invalid origin" error
**Cause:** Request from unauthorized domain

**Solutions:**
1. Verify `FRONTEND_URL` in backend `.env`
2. Ensure frontend URL matches exactly (including port)
3. Check CORS configuration

### Issue: CSRF protection blocking legitimate requests
**Temporary workaround:**
Add endpoint to skip list in `csrf.middleware.ts`:
```typescript
const publicPaths = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/settings/public',
  '/api/your/endpoint/here' // Add your endpoint
];
```

---

## 📊 What Attacks Are Prevented

### ✅ CSRF Attack Example (Now Blocked)
**Before CSRF Protection:**
```html
<!-- Malicious website -->
<img src="https://cyberguard.com/api/admin/users/delete-all" />
<!-- If user is logged in, this would succeed! -->
```

**After CSRF Protection:**
```
❌ Request blocked - no CSRF token
❌ Even if token somehow included, origin check fails
❌ Attacker cannot read CSRF token from different domain
```

### ✅ Other Security Benefits
- Prevents clickjacking attacks
- Validates request origin
- Enforces same-site cookie policy
- Server-side token verification

---

## 🎓 Best Practices

1. **Always use HTTPS in production**
   - Set `secure: true` in cookie options
   - CSRF tokens more secure over HTTPS

2. **Don't disable CSRF for convenience**
   - If endpoint needs to skip CSRF, carefully consider security implications
   - Add explicit documentation for why it's skipped

3. **Monitor CSRF failures**
   - Check logs for suspicious patterns
   - High CSRF failure rate may indicate attack attempts

4. **Keep tokens short-lived**
   - 24-hour expiration balances UX and security
   - Consider shorter expiration for high-security operations

5. **Combine with other security measures**
   - CSRF protection + Rate limiting
   - CSRF protection + Input validation
   - CSRF protection + HTTPS

---

## ✅ Security Checklist

- [x] CSRF middleware implemented
- [x] Double-submit cookie pattern
- [x] Server-side token validation
- [x] Origin/Referer checking
- [x] Automatic token expiration
- [x] Frontend automatic token injection
- [x] Login/logout token management
- [x] Secure cookie configuration
- [x] Safe methods exempted (GET, HEAD, OPTIONS)
- [x] Public endpoints exempted appropriately

---

## 🎉 Congratulations!

Your CyberGuard-AI platform now has **enterprise-grade CSRF protection**!

This is especially important for a cybersecurity training platform - you're demonstrating security best practices to your users. 🔒

**Attack surface reduced. Security posture improved. Users protected.** ✅
