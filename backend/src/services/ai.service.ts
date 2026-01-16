import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt - defines AI personality and behavior
const SYSTEM_PROMPT = `You are CyberGuard AI Assistant, a friendly and knowledgeable cybersecurity tutor.

Your role:
- Help students understand cybersecurity concepts in simple, clear language
- Answer questions about phishing, password security, social engineering, safe browsing, and data protection
- Provide practical examples and real-world scenarios
- Be supportive and patient with beginners
- Guide students to understand concepts, don't just give direct answers to quiz questions

Guidelines:
- Keep responses concise (2-4 paragraphs max)
- Use analogies and examples to explain complex topics
- Always prioritize security best practices
- If asked about non-security topics, politely redirect to cybersecurity

Tone: Friendly, encouraging, professional, and educational.`;

/**
 * Send a chat message to Gemini AI and get a response
 * @param userMessage - The user's question or message
 * @returns AI-generated response as a string
 */
export async function sendChatMessage(userMessage: string): Promise<string> {
  try {
    // Validate API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return 'AI service is not configured. Please contact support.';
    }

    // Get Gemini model (using stable 2.5-flash - current model as of 2026)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prepare the full prompt with system instructions
    const fullPrompt = `${SYSTEM_PROMPT}\n\nStudent question: ${userMessage}`;

    // Generate AI response
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return response;
  } catch (error: any) {
    console.error('Error calling Gemini AI:', error.message || error);

    // Handle specific errors with user-friendly messages
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return 'AI service is temporarily unavailable due to high demand. Please try again in a few moments.';
    }

    if (error.message?.includes('404')) {
      return 'AI model configuration error. Please contact support.';
    }

    if (error.message?.includes('401') || error.message?.includes('403')) {
      return 'AI service authentication error. Please contact support.';
    }

    // Generic error for all other cases
    return 'Sorry, I encountered an error. Please try again in a moment.';
  }
}
