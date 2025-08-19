export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'GPT-4o',
    description: 'OpenAI GPT-4o via OpenRouter',
  },
  {
    id: 'chat-model-reasoning',
    name: 'GPT-4o (Reasoning)',
    description: 'GPT-4o with enhanced reasoning capabilities',
  },
];
