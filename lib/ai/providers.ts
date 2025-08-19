import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// OpenRouter configuration
const openrouter = openai({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

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
        'chat-model': openrouter('openai/gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openrouter('openai/gpt-4o'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openrouter('openai/gpt-3.5-turbo'),
        'artifact-model': openrouter('openai/gpt-4o'),
      },
      imageModels: {
        'small-model': openrouter('openai/gpt-4o'),
      },
    });
