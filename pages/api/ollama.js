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
    prompt = `Provide a health analysis for a ${pet} with symptoms: "${symptom}" (max 400 words). Include causes, tips, and precautions, and output in strict HTML format with the following structure:

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
    prompt = `Provide detailed advice about feeding a ${pet} the following food: "${food}". Include whether it's good or bad for the pet, its nutritional value, and any relevant precautions. The output must be in strict HTML format with the following structure:

<div class="space-y-4 text-gray-800">
  <h2 class="text-xl font-semibold">Food Analysis for ${pet} and "${food}"</h2>

  <div class="bg-green-50 p-4 rounded-md">
    <p>Provide a detailed answer on whether this food is good or bad for ${pet}, considering nutrition, risks, and benefits. Output in HTML format.</p>
  </div>

  <div class="bg-yellow-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-yellow-600">Nutritional Information</h3>
    <p>Discuss the nutritional aspects of "${food}" for ${pet}, including key nutrients and whether it supports the pet’s diet. Output in HTML format.</p>
  </div>

  <div class="bg-red-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-red-600">Precautions</h3>
    <p>If there are any risks or concerns about feeding "${food}" to ${pet}, mention them here in HTML format.</p>
  </div>
</div>`;
  } else if (nutrition) {
    prompt = `Provide nutritional advice for a ${pet} on ${nutrition} (max 400 words). Include nutrients, benefits, and considerations, and output in strict HTML format with the following structure:

<div class="space-y-4 text-gray-800">
  <h2 class="text-xl font-semibold">Nutritional Advice for ${pet} of ${nutrition} </h2>

  <div class="bg-purple-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-purple-600">Can ${pet}s Eat ${nutrition}?</h3>
    <p>${food} may or may not be safe for ${pet}s depending on their dietary needs. This section will explain if it is safe, its potential benefits, and any risks.</p>
  </div>

  <div class="bg-green-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-green-600">Nutritional Benefits</h3>
    <p>${food} contains various nutrients such as vitamins and minerals that could be beneficial for ${pet}s. However, it should be fed in moderation as part of a balanced diet.</p>
  </div>

  <div class="bg-yellow-50 p-4 rounded-md">
    <h3 class="text-lg font-semibold text-yellow-600">Important Considerations</h3>
    <p class="text-sm">Consider portion sizes and possible allergic reactions. Some pets may have difficulty digesting ${nutrition}, and certain parts (like seeds or peels) may not be safe. Always introduce new foods gradually and consult a vet if unsure.</p>
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
