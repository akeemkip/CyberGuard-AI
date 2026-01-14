# AI Chat Quick Reference Card

## 🚀 Quick Start (5 minutes)

### 1. Add API Key
```bash
# Edit frontend/.env.local
VITE_COPILOT_API_KEY=your_key_here
```

### 2. Start Server
```bash
cd frontend
npm run dev
```

### 3. Test Chat
Navigate to AI Chat component and send a message!

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `src/app/services/copilot.service.ts` | API integration | ✅ Created |
| `src/app/components/ai-chat.tsx` | Chat UI | ✅ Updated |
| `.env.local` | API keys (local) | ✅ Created |
| `AI_CHAT_SETUP.md` | Detailed setup | ✅ Created |

---

## ⚙️ Environment Variables

```env
# Required
VITE_COPILOT_API_URL=https://api.copilot.microsoft.com/v1
VITE_COPILOT_API_KEY=your_actual_api_key

# Optional
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 💡 Main Functions

### Send Message with Streaming
```typescript
import { sendMessageToCopilot } from '../services/copilot.service';

await sendMessageToCopilot(
  messages,          // Array of ChatMessage
  (chunk) => {       // Real-time callback
    console.log(chunk);
  },
  true              // Enable streaming
);
```

### Get Security Context
```typescript
import { getCybersecurityContext } from '../services/copilot.service';

const context = getCybersecurityContext(userMessage);
```

---

## 🎯 Features

- ✅ Real-time streaming
- ✅ Conversation history
- ✅ Error handling with fallback
- ✅ Cybersecurity focus
- ✅ Keyboard shortcuts
- ✅ Auto-scroll
- ✅ Loading states

---

## 🔧 Troubleshooting

### Chat not responding?
```
1. Check .env.local has correct API key
2. Verify API endpoint URL
3. Check console (F12) for errors
4. Ensure input is not empty
```

### Streaming not working?
```
1. Verify VITE_COPILOT_API_URL is correct
2. Check network tab in DevTools
3. Ensure API supports streaming
4. Try non-streaming mode to test
```

### API Key errors?
```
1. Verify key format in .env.local
2. Check key hasn't expired
3. Ensure key has correct permissions
4. Generate new key if needed
```

---

## 📊 Component Props

```typescript
interface AIChatProps {
  userEmail: string;        // User's email
  onNavigate: (page: string) => void;  // Navigation callback
  onLogout: () => void;     // Logout callback
}
```

---

## 🎨 Customization

### Change Model
```typescript
// In copilot.service.ts line 65
model: 'gpt-4-turbo'        // Default
model: 'gpt-3.5-turbo'      // Faster/cheaper
```

### Adjust Response Length
```typescript
// In copilot.service.ts line 68
max_tokens: 1000            // Change this
```

### Modify Temperature (Creativity)
```typescript
// In copilot.service.ts line 66
temperature: 0.7            // 0=factual, 1=creative
```

---

## 🔒 Security Checklist

- [ ] API key in `.env.local` only
- [ ] `.env.local` in `.gitignore`
- [ ] Never commit API keys
- [ ] Use backend proxy for production
- [ ] Rotate keys monthly
- [ ] Monitor API usage

---

## 📚 Documentation

- **Setup Guide**: [AI_CHAT_SETUP.md](AI_CHAT_SETUP.md)
- **Backend Integration**: [BACKEND_INTEGRATION_GUIDE.md](../BACKEND_INTEGRATION_GUIDE.md)
- **Full Summary**: [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)

---

## 🆘 Getting Help

1. Check relevant documentation
2. Review console errors (F12)
3. Verify environment variables
4. Check API provider status
5. Contact development team

---

## 📞 API Providers

| Provider | URL | Docs |
|----------|-----|------|
| OpenAI | https://openai.com | https://platform.openai.com/docs |
| Microsoft | https://copilot.microsoft.com | Contact account manager |

---

**Happy Chatting! 🎉**
