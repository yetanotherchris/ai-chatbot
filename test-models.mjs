import modelsData from './models.json' with { type: 'json' };

console.log('Models from JSON:', modelsData.models.map(m => `${m.id}: ${m.name}`));

// Simulate the logic from models.ts
const baseModels = modelsData.models;
const reasoningModels = baseModels
  .filter(model => model.supportsTools !== false)
  .map(model => ({
    ...model,
    id: `${model.id}-reasoning`,
    name: `${model.name} (Reasoning)`,
    description: `${model.description} - with enhanced reasoning capabilities`,
  }));

const allModels = [...baseModels, ...reasoningModels];

console.log('\nAll available models (including reasoning):');
allModels.forEach(m => console.log(`- ${m.id}: ${m.name}`));
