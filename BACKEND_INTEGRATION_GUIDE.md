# Backend Integration Guide for AI Chat

This guide explains how to integrate the AI Chat Copilot service with your backend for enhanced security and rate limiting.

## Option 1: Direct Frontend API (Current Implementation)

### Pros:
- Simple setup
- Faster response times
- No backend modifications needed

### Cons:
- API key exposed in environment variables
- Rate limiting handled by Copilot provider
- Limited control over requests

### Setup:
```typescript
// .env.local
VITE_COPILOT_API_URL=https://api.copilot.microsoft.com/v1
VITE_COPILOT_API_KEY=your_api_key
```

## Option 2: Backend Proxy (Recommended for Production)

This approach routes all Copilot requests through your backend, providing better security, logging, and control.

### Pros:
- API key kept secure on backend
- Rate limiting per user
- Logging and analytics
- Custom middleware support
- Request validation

### Cons:
- Additional backend implementation
- Slight latency increase
- More infrastructure

### Backend Implementation Example

#### 1. Create Copilot Proxy Endpoint

**`backend/src/routes/copilot.routes.ts`:**
```typescript
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { copilotController } from '../controllers/copilot.controller';

const router = Router();

// Protect copilot routes with authentication
router.post('/chat', authMiddleware, copilotController.sendMessage);
router.post('/chat/stream', authMiddleware, copilotController.streamMessage);

export default router;
```

#### 2. Create Copilot Controller

**`backend/src/controllers/copilot.controller.ts`:**
```typescript
import axios from 'axios';
import { Request, Response } from 'express';

const COPILOT_API_KEY = process.env.COPILOT_API_KEY;
const COPILOT_API_URL = process.env.COPILOT_API_URL;

export const copilotController = {
  // Non-streaming response
  async sendMessage(req: Request, res: Response) {
    try {
      const { messages } = req.body;
      const userId = (req as any).user.id;

      // Validate messages
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      // Rate limiting check (implement based on your needs)
      // await checkRateLimit(userId);

      // Call Copilot API
      const response = await axios.post(
        `${COPILOT_API_URL}/chat/completions`,
        {
          model: 'gpt-4-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${COPILOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      // Log the interaction (optional)
      // await logCopilotInteraction(userId, messages, response.data);

      res.json(response.data);
    } catch (error) {
      console.error('Copilot API error:', error);
      res.status(500).json({ error: 'Failed to get response from AI assistant' });
    }
  },

  // Streaming response
  async streamMessage(req: Request, res: Response) {
    try {
      const { messages } = req.body;
      const userId = (req as any).user.id;

      // Validate messages
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Call Copilot API with streaming
      const response = await axios.post(
        `${COPILOT_API_URL}/chat/completions`,
        {
          model: 'gpt-4-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${COPILOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
          timeout: 30000,
        }
      );

      // Pipe the streaming response back to client
      response.data.on('data', (chunk: Buffer) => {
        const text = chunk.toString('utf-8');
        res.write(text);
      });

      response.data.on('end', () => {
        res.end();
      });

      response.data.on('error', (error: Error) => {
        console.error('Stream error:', error);
        res.write(`data: {"error": "${error.message}"}\n\n`);
        res.end();
      });
    } catch (error) {
      console.error('Copilot stream error:', error);
      res.status(500).json({ error: 'Failed to stream response from AI assistant' });
    }
  },
};
```

#### 3. Register Routes in Main App

**`backend/src/index.ts`:**
```typescript
import copilotRoutes from './routes/copilot.routes';

// ... other imports and setup ...

app.use('/api/copilot', copilotRoutes);
```

#### 4. Environment Variables

**`backend/.env`:**
```env
# Copilot API Configuration
COPILOT_API_KEY=your_actual_api_key
COPILOT_API_URL=https://api.copilot.microsoft.com/v1

# Other config
PORT=3000
DATABASE_URL=postgresql://...
```

### Frontend Changes for Backend Proxy

#### Update `copilot.service.ts`:

```typescript
import api from './api'; // Use your existing axios instance

const API_BASE_URL = '/api/copilot';

export async function sendMessageToCopilot(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  stream: boolean = true
): Promise<string> {
  try {
    const endpoint = stream ? `${API_BASE_URL}/chat/stream` : `${API_BASE_URL}/chat`;
    
    const payload = {
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    if (stream && onChunk) {
      return await streamFromBackend(endpoint, payload, onChunk);
    } else {
      const response = await api.post(endpoint, payload);
      return response.data?.choices?.[0]?.message?.content;
    }
  } catch (error) {
    console.error('Error sending message to Copilot:', error);
    throw error;
  }
}

async function streamFromBackend(
  endpoint: string,
  payload: any,
  onChunk: (chunk: string) => void
): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  let fullContent = '';
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          const content = parsed?.choices?.[0]?.delta?.content || '';
          if (content) {
            fullContent += content;
            onChunk(content);
          }
        } catch (e) {
          // Skip parsing errors
        }
      }
    }
  }

  return fullContent;
}
```

## Option 3: Hybrid Approach

Combine frontend direct API with backend fallback:

```typescript
async function sendMessageToCopilot(...) {
  try {
    // Try backend first
    return await sendThroughBackend(...);
  } catch (error) {
    // Fallback to direct frontend API
    return await sendThroughFrontend(...);
  }
}
```

## Rate Limiting Example

Add rate limiting middleware to protect against abuse:

```typescript
import rateLimit from 'express-rate-limit';

const copilotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per windowMs
  message: 'Too many chat requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/chat', copilotLimiter, authMiddleware, copilotController.sendMessage);
```

## Logging Example

```typescript
async function logCopilotInteraction(
  userId: string,
  messages: ChatMessage[],
  response: any
) {
  // Log to database
  await db.copilotLog.create({
    userId,
    messageCount: messages.length,
    responseTokens: response.usage?.completion_tokens,
    timestamp: new Date(),
  });
}
```

## Security Checklist

- [ ] API key stored in backend environment variables only
- [ ] All requests require authentication
- [ ] Rate limiting implemented per user
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] Request logging and monitoring enabled
- [ ] Error messages don't expose sensitive info
- [ ] API key rotation scheduled

## Monitoring & Analytics

Track usage with:
- Request count per user
- Response times
- Error rates
- Token usage
- Most common queries

## Migration Guide

To migrate from direct API to backend proxy:

1. **Deploy backend changes first**
2. **Update frontend `.env.local`** to point to backend
3. **Update copilot.service.ts** to use `/api/copilot` endpoints
4. **Test thoroughly** before removing frontend API key
5. **Update documentation**
6. **Remove API key from frontend .env**

## Troubleshooting

### Backend Proxy Issues

**Problem**: 401 Unauthorized from Copilot API
- **Solution**: Verify `COPILOT_API_KEY` in backend `.env`

**Problem**: CORS errors
- **Solution**: Add Copilot API origin to CORS whitelist if needed

**Problem**: Timeout errors
- **Solution**: Increase `timeout` value in axios config

**Problem**: Streaming not working
- **Solution**: Verify response headers and ensure SSE format

## Performance Tips

1. **Implement caching** for common questions
2. **Queue requests** during high load
3. **Use connection pooling** for API
4. **Monitor token usage** to optimize costs
5. **Cache embeddings** if using vector search

---

Choose the implementation strategy that best fits your security and scalability requirements.
