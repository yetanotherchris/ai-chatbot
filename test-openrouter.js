// Test script to debug OpenRouter integration
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Recreate the same configuration
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': 'https://localhost:3000',
    'X-Title': 'AI Chatbot Test',
  },
});

async function testTitleGeneration() {
  try {
    console.log('Testing title generation...');
    console.log('API Key present:', !!process.env.OPENROUTER_API_KEY);
    
    const { text: title } = await generateText({
      model: openrouter('openai/gpt-3.5-turbo'),
      system: `
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify({ role: 'user', content: 'Hello, how are you?' }),
    });

    console.log('Generated title:', title);
  } catch (error) {
    console.error('Error:', error);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
}

testTitleGeneration();
