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
import { chatModels } from './models';
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
console.log('Available models from environment:', chatModels.map(m => `${m.id}: ${m.name} (${m.openrouterModel})`));

// Create dynamic language models from parsed environment models
function createLanguageModels() {
  if (isTestEnvironment) {
    return {
      'chat-model': chatModel,
      'chat-model-reasoning': reasoningModel,
      'title-model': titleModel,
      'artifact-model': artifactModel,
    };
  }

  const models: Record<string, any> = {};

  // Add all configured chat models
  chatModels.forEach((model) => {
    if (model.openrouterModel) {
      if (model.reasoning) {
        // Apply reasoning middleware for reasoning models
        models[model.id] = wrapLanguageModel({
          model: openrouter.chatModel(model.openrouterModel),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        });
      } else {
        // Regular model without reasoning
        models[model.id] = openrouter.chatModel(model.openrouterModel);
      }
    }
  });

  // Add utility models (using first available model as fallback)
  const primaryModel = chatModels[0]?.openrouterModel || 'openai/gpt-4o';
  models['title-model'] = openrouter.chatModel('openai/gpt-3.5-turbo'); // Keep lightweight model for titles
  models['artifact-model'] = openrouter.chatModel(primaryModel);

  return models;
}

export const myProvider = customProvider({
  languageModels: createLanguageModels(),
  imageModels: {
    'small-model': openrouter.imageModel('openai/dall-e-3'),
  },
});
