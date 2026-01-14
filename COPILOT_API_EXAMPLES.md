# Copilot API - Example Requests & Responses

## Example 1: Basic Chat Message

### Request
```typescript
const messages: ChatMessage[] = [
  {
    role: 'user',
    content: 'What is phishing and how can I identify it?'
  }
];

await sendMessageToCopilot(messages, (chunk) => {
  console.log(chunk);
}, true);
```

### API Payload Sent
```json
{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "assistant",
      "content": "You are an expert cybersecurity training assistant..."
    },
    {
      "role": "user",
      "content": "What is phishing and how can I identify it?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 0.95,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "stream": true
}
```

### Streaming Response (SSE Format)
```
data: {"choices":[{"delta":{"content":"Phishing"},"finish_reason":null}]}

data: {"choices":[{"delta":{"content":" is"},"finish_reason":null}]}

data: {"choices":[{"delta":{"content":" a"},"finish_reason":null}]}

data: {"choices":[{"delta":{"content":" type"},"finish_reason":null}]}

...

data: [DONE]
```

### Final Text Output
```
Phishing is a type of cyber attack where attackers impersonate legitimate organizations to steal sensitive information. Here are key ways to identify phishing:

1. Check the sender's email address carefully
2. Look for urgent or threatening language
3. Verify links before clicking (hover to see actual URL)
4. Be suspicious of requests for personal information
5. Check for spelling and grammar errors

Additional indicators include:
- Unexpected attachments
- Requests for password or account information
- Generic greetings instead of your name
- Mismatched URLs (hover to verify)
- Poor grammar and spelling
```

---

## Example 2: Conversation with Context

### Request with History
```typescript
const messages: ChatMessage[] = [
  {
    role: 'user',
    content: 'What is phishing?'
  },
  {
    role: 'assistant',
    content: 'Phishing is a cyber attack where attackers impersonate legitimate organizations...'
  },
  {
    role: 'user',
    content: 'How can I protect myself?'
  }
];

await sendMessageToCopilot(messages);
```

### API Response (Non-streaming)
```json
{
  "id": "chatcmpl-8nNxXXXXXXXXXXXX",
  "object": "text_completion",
  "created": 1705240234,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Here are key ways to protect yourself from phishing:\n\n1. **Email Verification**\n   - Check sender address carefully\n   - Look for slight variations in company domains\n   - Verify unexpected emails directly with the company\n\n2. **Link Safety**\n   - Hover over links to see actual URL\n   - Don't click suspicious links\n   - Verify SSL certificates (https)\n\n3. **Information Protection**\n   - Never share passwords via email\n   - Be suspicious of urgent requests\n   - Verify requests through official channels\n\n4. **Technical Measures**\n   - Use multi-factor authentication (MFA)\n   - Keep software updated\n   - Use email filtering\n   - Install antivirus software\n\n5. **User Awareness**\n   - Be skeptical of unexpected emails\n   - Report suspicious emails\n   - Educate yourself on new attack methods"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 245,
    "completion_tokens": 198,
    "total_tokens": 443
  }
}
```

---

## Example 3: Error Response

### Invalid API Key
```json
{
  "error": {
    "message": "Incorrect API key provided. You can find your API key at https://platform.openai.com/account/api-keys.",
    "type": "invalid_request_error",
    "param": null,
    "code": "invalid_api_key"
  }
}
```

### Rate Limited
```json
{
  "error": {
    "message": "Rate limit exceeded. Please retry after 5 seconds.",
    "type": "server_error",
    "param": null,
    "code": "rate_limit_exceeded"
  }
}
```

### Timeout (No Response)
```
Error: timeout of 30000ms exceeded
```

---

## Example 4: Streaming Implementation Details

### SSE Event Stream
```
event: message
data: {"choices":[{"delta":{"role":"assistant","content":""},"index":0}]}

event: message
data: {"choices":[{"delta":{"content":"To"},"index":0}]}

event: message
data: {"choices":[{"delta":{"content":" protect"},"index":0}]}

event: message
data: {"choices":[{"delta":{"content":" yourself"},"index":0}]}

...

event: message
data: [DONE]
```

### How Component Processes
```typescript
// Raw chunk from API
"To protect yourself from phishing attacks, follow these steps:\n\n1. Verify senders..."

// Component updates state
setMessages(prev => prev.map(msg => 
  msg.id === assistantMessageId
    ? { ...msg, content: fullContent + chunk } // Add chunk to existing content
    : msg
))

// Display renders immediately
<p>{message.content}</p> // Shows accumulated text so far
```

---

## Example 5: Different System Prompts

### Cybersecurity Focus
```json
{
  "role": "assistant",
  "content": "You are an expert cybersecurity training assistant specialized in enterprise security awareness training. Focus on practical, real-world scenarios and actionable advice for protecting against common threats like phishing, social engineering, and malware."
}
```

### General Assistant
```json
{
  "role": "assistant",
  "content": "You are a helpful AI assistant. Answer questions accurately and thoroughly, providing examples where helpful."
}
```

### Technical Expert
```json
{
  "role": "assistant",
  "content": "You are an expert software engineer. Provide detailed technical explanations with code examples and best practices."
}
```

---

## Example 6: Token Usage

### Token Counting
```
User: "What is phishing?" (3 tokens)
Assistant: "Phishing is..." (45 tokens)
Total: 48 tokens

Cost at $0.03/1K tokens = $0.00144
```

### Optimizing Token Usage
```typescript
// ❌ Inefficient - Entire history sent each time
const allMessages = [...fullHistory]; // 500 tokens
await sendMessageToCopilot(allMessages);

// ✅ Better - Keep context but limit history
const recentMessages = fullHistory.slice(-10); // 150 tokens
await sendMessageToCopilot(recentMessages);

// ✅ Best - Smart context window
const messages = selectImportantMessages(fullHistory, maxTokens: 500);
await sendMessageToCopilot(messages);
```

---

## Example 7: Error Recovery Flow

### Component Error Handling
```typescript
try {
  // Try to get real response
  fullResponse = await sendMessageToCopilot(apiMessages, onChunk, true);
} catch (apiError) {
  // Fall back to hardcoded response
  console.warn("API error, using fallback", apiError);
  
  if (apiError.message.includes("phishing")) {
    fallbackResponse = aiResponses.phishing;
  } else {
    fallbackResponse = aiResponses.default;
  }
  
  // Show user an error alert
  setError("API Unavailable - Using cached response");
  
  // Clear error after 5 seconds
  setTimeout(() => setError(null), 5000);
}
```

---

## Example 8: Conversation Flow

### User Journey
```
1. User opens AI Chat
   ├─ Component initializes
   ├─ Sets up message state
   └─ Shows initial greeting + suggested prompts

2. User clicks suggested prompt OR types message
   ├─ Message added to display
   ├─ Input cleared
   ├─ isTyping set to true
   └─ Message added to conversation history

3. Component calls sendMessageToCopilot()
   ├─ Validates messages
   ├─ Creates API payload
   ├─ Sends to Copilot API
   └─ Sets up streaming listener

4. API streams response chunks
   ├─ Each chunk arrives in callback
   ├─ fullResponse accumulates
   ├─ Component re-renders in real-time
   └─ User sees character-by-character display

5. Stream completes [DONE] signal
   ├─ Full response stored in history
   ├─ streaming flag set to false
   └─ isTyping set to false

6. User can now send another message
   └─ Process repeats
```

---

## Example 9: Configuration Impact

### Response Temperature
```
Temperature 0.0 (Deterministic)
Q: "What is cybersecurity?"
A: "Cybersecurity is the practice of protecting computer systems..."
A: "Cybersecurity is the practice of protecting computer systems..." (Same)

Temperature 0.7 (Balanced)
Q: "What is cybersecurity?"
A: "Cybersecurity is the practice of protecting computer systems..."
A: "In our digital world, cybersecurity represents the..." (Different)

Temperature 1.0 (Creative)
Q: "What is cybersecurity?"
A: "Imagine a digital fortress protecting your data..."
A: "Think of cybersecurity as your digital bodyguard..." (Very different)
```

### Max Tokens Impact
```
max_tokens: 50   → Short responses
Q: "Explain AI"
A: "AI stands for Artificial Intelligence. It's a field of computer science that focuses on creating intelligent machines..." (truncated)

max_tokens: 500  → Normal responses
Q: "Explain AI"
A: "Artificial Intelligence (AI) is a field of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence..."

max_tokens: 2000 → Detailed responses
Q: "Explain AI"
A: "[Long, comprehensive explanation with examples and use cases]"
```

---

## Example 10: Real Error Handling

### 401 Unauthorized
```typescript
catch (error) {
  if (error.response?.status === 401) {
    setError("Invalid API key. Please check your configuration.");
    // User action: Update .env.local
  }
}
```

### Network Error
```typescript
catch (error) {
  if (error.code === 'ECONNREFUSED') {
    setError("Cannot connect to API. Check your connection.");
    // User action: Check internet, check API status
  }
}
```

### Timeout
```typescript
catch (error) {
  if (error.code === 'ECONNABORTED') {
    setError("Request timed out. API may be overloaded.");
    // User action: Retry, or check API status page
  }
}
```

---

## Testing with cURL

### Basic Request
```bash
curl -X POST https://api.copilot.microsoft.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role": "user", "content": "What is phishing?"}
    ],
    "stream": false
  }'
```

### Streaming Request
```bash
curl -X POST https://api.copilot.microsoft.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role": "user", "content": "What is phishing?"}
    ],
    "stream": true
  }'
```

---

## Performance Metrics

### Typical Response Times
```
API Key Validation:        ~10ms
Message Processing:        ~50ms
Model Generation Start:    ~500ms
Streaming First Chunk:     ~1000ms
Full Response (typical):   ~5000ms
Stream Completion:         ~5000ms
```

### Network Usage
```
Request Size:    ~500 bytes
Response Size:   ~2-5 KB per message
Monthly (100/day): ~150-300 MB
```

---

This document provides practical examples of how the Copilot API integrates with the AI Chat component.
