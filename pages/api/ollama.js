import { fetchOllamaResponse } from '../../lib/ollama';

export const config = {
  api: {
    responseLimit: false, // No response limit
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { pet, symptom, food, nutrition } = req.body;

  // Validate inputs
  if (!pet || typeof pet !== 'string' || !(symptom || food || nutrition)) {
    return res.status(400).json({
      error: 'Provide a valid pet and at least one of symptom, food, or nutrition.',
    });
  }

  let prompt = '';

  // Construct the prompt with unified HTML styling
  if (symptom) {
    prompt = `Provide a health analysis for a ${pet} with symptoms: "${symptom}" (max 400 words). Include causes, tips, and precautions in this format:

<div class="space-y-4 text-gray-800">
  <h2 class="text-xl font-semibold">Health Analysis for ${pet}</h2>

  <div class="bg-blue-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-blue-600">Possible Causes</h3>
    <ul class="list-disc list-inside">
      <li>Possible cause 1</li>
      <li>Possible cause 2</li>
    </ul>
  </div>

  <div class="bg-yellow-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-yellow-600">Advice for Owners</h3>
    <ul class="list-disc list-inside">
      <li>Monitor symptoms</li>
      <li>Provide hydration and comfort</li>
      <li>Avoid allergens or irritants</li>
    </ul>
  </div>

  <div class="bg-red-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-red-600">Important Precautions</h3>
    <p>If symptoms persist, consult a veterinarian immediately.</p>
  </div>
</div>`;
  } else if (food) {
    prompt = `Suggest 3 foods for a ${pet} based on "${food}" (max 400 words). Include benefits and notes in this format:

<div class="space-y-4 text-gray-800">
  <h2 class="text-xl font-semibold">Food Recommendations for ${pet}</h2>

  <ul class="space-y-3">
    <li class="bg-green-50 p-3 rounded-md">
      <span class="font-semibold text-green-600">Food Name 1</span>
      <p>Nutritional benefits: Brief description</p>
      <p class="text-sm text-gray-600">Best for: Conditions or needs</p>
    </li>
    <li class="bg-green-50 p-3 rounded-md">
      <span class="font-semibold text-green-600">Food Name 2</span>
      <p>Nutritional benefits: Brief description</p>
      <p class="text-sm text-gray-600">Best for: Conditions or needs</p>
    </li>
  </ul>
</div>`;
  } else if (nutrition) {
    prompt = `Provide nutritional advice for a ${pet} on "${nutrition}" (max 400 words). Include nutrients, benefits, and considerations in this format:

<div class="space-y-4 text-gray-800">
  <h2 class="text-xl font-semibold">Nutritional Advice for ${pet}</h2>

  <div class="bg-purple-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-purple-600">Nutritional Recommendations</h3>
    <p>Explanation of essential nutrients and their benefits.</p>
  </div>

  <div class="bg-yellow-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-yellow-600">Important Considerations</h3>
    <p class="text-sm">Consider portion sizes and dietary restrictions.</p>
  </div>
</div>`;
  }

  try {
    let responseContent = await fetchOllamaResponse(prompt);

    if (!responseContent || responseContent === 0) {
      return res.status(500).json({ error: 'No valid response from Ollama API' });
    }

    responseContent = responseContent.replace(/```html\n?|\n?```/g, ''); // Remove code block markers
    responseContent = responseContent.replace(/^[\s\S]*?<div/m, '<div'); // Keep only the relevant HTML
    responseContent = responseContent.replace(/<\/div>[\s\S]*?$/m, '</div>'); // Clean after last closing div

    return res.status(200).json({ suggestion: responseContent.trim() });
  } catch (error) {
    console.error('Error in Ollama API:', error);
    return res.status(500).json({ error: error.message });
  }
}
