import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// OpenRouter configuration
console.log('OpenRouter API Key:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
console.log('Environment - isTestEnvironment:', isTestEnvironment);
console.log('Environment - NODE_ENV:', process.env.NODE_ENV);

const openrouter = createOpenAICompatible({
  baseURL: 'https://openrouter.ai/api/v1',
  name: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': 'https://localhost:3000', // Optional, for including your app name in API logs
    'X-Title': 'AI Chatbot', // Optional, shows in OpenRouter logs
  },
});

console.log('OpenRouter provider created successfully');

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openrouter.chatModel('openai/gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openrouter.chatModel('openai/gpt-4o'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openrouter.chatModel('openai/gpt-3.5-turbo'),
        'artifact-model': openrouter.chatModel('openai/gpt-4o'),
      },
      imageModels: {
        'small-model': openrouter.imageModel('openai/dall-e-3'),
      },
    });
