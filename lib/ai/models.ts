// Import models data directly from the JSON file
import modelsData from '../../models.json';

export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  openrouterModel?: string;
  default?: boolean;
  supportsTools?: boolean;
  reasoning?: boolean;
}

// Parse models from imported JSON data
function parseModelsFromData(): Array<ChatModel> {
  try {
    if (!modelsData.models || !Array.isArray(modelsData.models)) {
      console.warn('Invalid models.json structure, using fallback models');
      return getFallbackModels();
    }

    const models = modelsData.models.filter((model: any) => {
      if (!model.id || !model.name || !model.openrouterModel) {
        console.warn(`Invalid model entry: ${JSON.stringify(model)}`);
        return false;
      }
      return true;
    });

    // Ensure we always have at least one model
    if (models.length === 0) {
      console.warn('No valid models found in models.json, using fallback models');
      return getFallbackModels();
    }

    console.log(`Loaded ${models.length} models from models.json:`, models.map((m: ChatModel) => m.name));
    return models;

  } catch (error) {
    console.error('Error parsing models data:', error);
    return getFallbackModels();
  }
}

function getFallbackModels(): Array<ChatModel> {
  return [
    {
      id: 'chat-model',
      name: 'GPT-4o',
      description: 'OpenAI GPT-4o via OpenRouter (fallback)',
      openrouterModel: 'openai/gpt-4o',
      default: true,
      reasoning: false,
    },
    {
      id: 'chat-model-reasoning',
      name: 'GPT-4o (Reasoning)',
      description: 'GPT-4o with enhanced reasoning capabilities (fallback)',
      openrouterModel: 'openai/gpt-4o',
      reasoning: true,
    },
  ];
}

export const chatModels: Array<ChatModel> = parseModelsFromData();
