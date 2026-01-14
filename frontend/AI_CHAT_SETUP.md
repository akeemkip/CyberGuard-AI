# AI Chat Integration Guide

## Overview
The AI Chat component is now fully integrated with a Copilot API service, providing real-time streaming chat capabilities with fallback mechanisms.

## Features
- ✅ Real-time streaming responses from Copilot API
- ✅ Conversation context persistence
- ✅ Cybersecurity-specific system prompts
- ✅ Fallback responses when API is unavailable
- ✅ Error handling with user-friendly messages
- ✅ Message streaming with visual indicators
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- ✅ Auto-scrolling to latest messages
- ✅ Suggested prompts for quick start

## Setup Instructions

### 1. Install Dependencies
Make sure you have the required packages in your `package.json`. The project already includes:
- `axios` for HTTP requests
- React hooks for state management

### 2. Environment Configuration

#### Create `.env.local` file in the frontend directory
```bash
# Copilot API Configuration
VITE_COPILOT_API_URL=https://api.copilot.microsoft.com/v1
VITE_COPILOT_API_KEY=your_actual_copilot_api_key

# Backend API Configuration (optional)
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Get Your Copilot API Key
1. Visit [OpenAI Platform](https://platform.openai.com/) or your Copilot provider
2. Create an API key
3. Add it to your `.env.local` file
4. Never commit `.env.local` to version control

### 3. File Structure
```
frontend/
├── src/
│   └── app/
│       ├── components/
│       │   └── ai-chat.tsx (Updated)
│       └── services/
│           └── copilot.service.ts (New)
├── .env.example (New)
├── .env.local (New - Local only)
└── vite.config.ts
```

## Component Usage

### Importing the Component
```typescript
import { AIChat } from "@/app/components/ai-chat";

<AIChat 
  userEmail="user@example.com"
  onNavigate={(page) => console.log(page)}
  onLogout={() => console.log("logged out")}
/>
```

### Props
- `userEmail` (string): The current user's email address
- `onNavigate` (function): Callback for navigation between pages
- `onLogout` (function): Callback for user logout

## API Service Details

### `copilot.service.ts`
The Copilot service provides:

#### `sendMessageToCopilot(messages, onChunk?, stream?)`
Sends messages to Copilot API with optional streaming support.

**Parameters:**
- `messages`: Array of ChatMessage objects (user/assistant pairs)
- `onChunk`: Callback function that receives streaming chunks in real-time
- `stream`: Boolean to enable/disable streaming (default: true)

**Returns:** Promise resolving to the complete response string

**Example:**
```typescript
const response = await sendMessageToCopilot(
  [{ role: "user", content: "What is phishing?" }],
  (chunk) => console.log(chunk), // Real-time chunks
  true // Enable streaming
);
```

#### `getCybersecurityContext(userMessage)`
Generates cybersecurity-specific system prompts for better context.

**Returns:** Array of ChatMessage objects with system context

## Error Handling

The component includes comprehensive error handling:

1. **API Unavailable**: Falls back to hardcoded responses
2. **Network Errors**: Displays user-friendly error messages (auto-clears after 5 seconds)
3. **Validation**: Ensures messages are properly formatted before sending
4. **Graceful Degradation**: Users can still chat with fallback responses

### Error Messages
- "API Unavailable - Using fallback response"
- "Unauthorized: Please check your Copilot API key"
- "Failed to process your message. Please try again."

## Streaming Behavior

The component supports real-time streaming responses:
- Messages display character-by-character as they arrive
- Animated pulse indicator shows streaming status
- "Stop" button appears during streaming to allow cancellation
- Full message is recorded in conversation history once complete

## Fallback Responses

If the Copilot API is unavailable, responses are auto-selected based on keywords:

| Keyword | Category |
|---------|----------|
| phish | Phishing Detection |
| password, credential | Password Security |
| social engineering, manipulation | Social Engineering |
| click + link | Suspicious Link Response |
| (default) | General Help |

## Conversation Context

The component maintains conversation history for context-aware responses:
- System prompt is automatically included
- Previous messages are sent with each request
- Conversation state persists during the session
- History resets on page reload

## Testing

### Test the Chat Component

1. **Start the development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to AI Chat page**

3. **Test scenarios:**
   - Send a message about phishing
   - Use suggested prompts
   - Test keyboard shortcuts (Enter, Shift+Enter)
   - Check error handling (disable internet)
   - Verify streaming (should see character-by-character display)

### Common Test Prompts
- "What is phishing and how can I identify it?"
- "Explain password security best practices"
- "How do I recognize social engineering attacks?"
- "What should I do if I click on a suspicious link?"

## Troubleshooting

### Issue: "API Unavailable" Error
**Solution:**
1. Check your API key in `.env.local`
2. Verify the API endpoint URL is correct
3. Ensure your Copilot API key has sufficient quota
4. Check network connection

### Issue: Streaming Not Working
**Solution:**
1. Verify `stream: true` parameter is being used
2. Check browser console for specific error messages
3. Ensure API supports streaming responses

### Issue: Messages Not Appearing
**Solution:**
1. Check that messages aren't empty
2. Verify input validation is passing
3. Check browser console for errors
4. Ensure conversation history is properly maintained

### Issue: Can't Send Messages
**Solution:**
1. Check if input field is disabled (isTyping state)
2. Verify message content is not empty
3. Check browser console for JavaScript errors
4. Clear browser cache and reload

## Performance Considerations

- **Streaming**: Enables real-time user feedback without waiting for complete response
- **Message History**: Stored in React state (limited to session duration)
- **API Calls**: Each message triggers one API call
- **Fallback Responses**: Pre-computed, no additional network requests

## Security Considerations

⚠️ **Important Security Notes:**
1. Never expose API keys in client-side code
2. Always use environment variables for sensitive data
3. Consider implementing rate limiting on the backend
4. Validate user input before sending to API
5. Use HTTPS for all API communications
6. Keep API keys rotated regularly
7. Monitor API usage for suspicious activity

## Future Enhancements

Potential improvements to consider:
- [ ] Export conversation history as PDF
- [ ] Clear history button
- [ ] Conversation topics/categories
- [ ] User feedback ratings (helpful/not helpful)
- [ ] Integration with user progress tracking
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Message search functionality
- [ ] Conversation bookmarking
- [ ] Rate limiting and quotas per user

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify environment configuration
4. Check API documentation for rate limits/quotas
5. Contact the development team if needed

## Files Modified/Created

### Created Files:
- `frontend/src/app/services/copilot.service.ts` - Copilot API service
- `frontend/.env.example` - Environment variable template
- `frontend/.env.local` - Local environment configuration

### Modified Files:
- `frontend/src/app/components/ai-chat.tsx` - Updated with API integration

## Version Information
- React: ^18.0.0
- TypeScript: Latest
- Axios: ^1.13.2
- Node: 16+ recommended
