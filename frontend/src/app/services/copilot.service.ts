import axios from 'axios';

const COPILOT_API_BASE_URL = import.meta.env.VITE_COPILOT_API_URL || 'https://api.copilot.microsoft.com/v1';
const COPILOT_API_KEY = import.meta.env.VITE_COPILOT_API_KEY;

// Create axios instance for Copilot API
const copilotApi = axios.create({
  baseURL: COPILOT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${COPILOT_API_KEY}`,
  },
  timeout: 30000,
});

// Add response interceptor for error handling
copilotApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Copilot API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a message to Copilot and get a response
 * Supports both regular completion and streaming responses
 */
export async function sendMessageToCopilot(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  stream: boolean = true
): Promise<string> {
  try {
    // Filter out empty messages and ensure proper format
    const validMessages = messages.filter(msg => msg.content.trim());

    if (validMessages.length === 0) {
      throw new Error('No valid messages to send');
    }

    const payload = {
      model: 'gpt-4-turbo', // or use gpt-3.5-turbo for faster responses
      messages: validMessages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: stream,
    };

    if (stream && onChunk) {
      return await streamCopilotResponse(payload, onChunk);
    } else {
      return await getNonStreamingCopilotResponse(payload);
    }
  } catch (error) {
    console.error('Error sending message to Copilot:', error);
    throw error;
  }
}

/**
 * Get a non-streaming response from Copilot
 */
async function getNonStreamingCopilotResponse(payload: any): Promise<string> {
  try {
    const response = await copilotApi.post('/chat/completions', payload);
    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Invalid response format from Copilot API');
    }

    return content;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Unauthorized: Please check your Copilot API key');
    }
    throw error;
  }
}

/**
 * Stream response from Copilot API
 */
async function streamCopilotResponse(
  payload: any,
  onChunk: (chunk: string) => void
): Promise<string> {
  try {
    const response = await copilotApi.post('/chat/completions', payload, {
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      let fullContent = '';
      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
        const text = chunk.toString('utf-8');
        buffer += text;

        // Process complete lines
        const lines = buffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content || '';
              
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch (e) {
              // Skip parsing errors for incomplete JSON
              console.debug('Skipping unparseable SSE data');
            }
          }
        }

        // Keep the last incomplete line in buffer
        buffer = lines[lines.length - 1];
      });

      response.data.on('end', () => {
        if (fullContent.trim()) {
          resolve(fullContent);
        } else {
          reject(new Error('No response content received from Copilot API'));
        }
      });

      response.data.on('error', (error: any) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error streaming from Copilot API:', error);
    throw error;
  }
}

/**
 * Get cybersecurity-specific context for better responses
 */
export function getCybersecurityContext(userMessage: string): ChatMessage[] {
  const systemPrompt: ChatMessage = {
    role: 'assistant',
    content: `You are an expert cybersecurity training assistant. You provide clear, accurate, and actionable information about:
- Phishing detection and prevention
- Password security best practices
- Social engineering tactics and defense strategies
- Malware identification and protection
- Data breach response procedures
- Compliance and security standards
- Safe browsing and email practices
- Multi-factor authentication and security tools

Always provide practical, real-world examples and actionable advice. Be encouraging and help users understand the "why" behind security practices.`,
  };

  return [systemPrompt];
}

export default copilotApi;
