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

  // Construct the prompt with concise HTML formatting
  if (symptom) {
    prompt = `Provide a detailed health analysis for a ${pet} exhibiting the following symptoms: "${symptom}". Provide possible causes, tips for managing the symptoms, and precautions. Use this Format  HTML with Tailwind classes:

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-gray-800">Health Analysis for ${pet}</h2>
  
  <div class="bg-blue-50 p-4 rounded-md">
    <h3 class="font-semibold text-blue-600">Possible Causes</h3>
    <ul class="list-disc list-inside text-gray-700">
      <li>Possible cause 1 (e.g., infection, allergy)</li>
      <li>Possible cause 2 (e.g., digestive issue, toxicity)</li>
    </ul>
  </div>

  <div class="bg-yellow-50 p-4 rounded-md">
    <h3 class="font-semibold text-yellow-600">Advice for Owners</h3>
    <ul class="list-disc list-inside text-gray-700">
      <li>Monitor symptoms closely</li>
      <li>Provide sufficient hydration and comfort</li>
      <li>Avoid any potential allergens or irritants</li>
    </ul>
  </div>

  <div class="bg-red-50 p-4 rounded-md">
    <h3 class="font-semibold text-red-600">Important Precautions</h3>
    <p class="text-gray-700">If symptoms persist or worsen, consult a veterinarian immediately for proper diagnosis and treatment.</p>
  </div>

  <p class="text-sm text-gray-500 mt-4">Note: This analysis is for informational purposes only. Always consult with a veterinarian for proper diagnosis and treatment.</p>
</div>`;
  } else if (food) {
    prompt = `Suggest 3-4 foods for a ${pet} based on "${food}". Provide the nutritional benefits of each food, and indicate how they might help with the pet’s health or dietary needs. Use this Format  HTML with Tailwind classes:

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-gray-800">Food Recommendations for ${pet}</h2>
  
  <ul class="space-y-3">
    <li class="bg-green-50 p-3 rounded-md">
      <span class="font-medium text-green-600">Food Name 1</span>
      <p class="text-sm text-gray-700">Nutritional benefits: [Brief description of health benefits]</p>
      <p class="text-xs text-gray-500">Best for: [Health conditions or needs]</p>
    </li>
    <li class="bg-green-50 p-3 rounded-md">
      <span class="font-medium text-green-600">Food Name 2</span>
      <p class="text-sm text-gray-700">Nutritional benefits: [Brief description of health benefits]</p>
      <p class="text-xs text-gray-500">Best for: [Health conditions or needs]</p>
    </li>
    <li class="bg-green-50 p-3 rounded-md">
      <span class="font-medium text-green-600">Food Name 3</span>
      <p class="text-sm text-gray-700">Nutritional benefits: [Brief description of health benefits]</p>
      <p class="text-xs text-gray-500">Best for: [Health conditions or needs]</p>
    </li>
  </ul>

  <p class="text-sm text-gray-500 mt-4">Note: Always introduce new foods gradually and consult with a veterinarian about your pet's specific dietary needs.</p>
</div>`;
  } else if (nutrition) {
    prompt = `Provide nutritional advice for a ${pet} on "${nutrition}". Include key nutrients, their benefits, and any important considerations regarding portion sizes or potential health issues. Use this Format HTML with Tailwind classes:

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-gray-800">Nutritional Advice for ${pet}</h2>
  
  <div class="bg-purple-50 p-4 rounded-md">
    <h3 class="font-semibold text-purple-600">Nutritional Recommendations</h3>
    <p class="text-gray-700">Explanation of essential nutrients for ${pet} and how they contribute to overall health (e.g., protein, fat, fiber, vitamins).</p>
  </div>

  <div class="bg-yellow-50 p-4 rounded-md">
    <h4 class="font-semibold text-yellow-600">Important Considerations</h4>
    <p class="text-sm text-gray-700">Be cautious about portion sizes and dietary restrictions specific to your pet's age, breed, or health conditions (e.g., kidney disease, obesity).</p>
  </div>

  <p class="text-sm text-gray-500 mt-4">Note: This advice is general. Always consult with a veterinary nutritionist for personalized dietary plans.</p>
</div>`;
  }

  try {
    // Fetch the response from Ollama API
    let responseContent = await fetchOllamaResponse(prompt);

    // Ensure responseContent is valid
    if (!responseContent || responseContent === 0) {
      return res.status(500).json({ error: 'No valid response from Ollama API' });
    }

    // Clean up the response (if necessary)
    responseContent = responseContent.replace(/```html\n?|\n?```/g, ''); // Remove ```html and ``` tags
    responseContent = responseContent.replace(/^[\s\S]*?<div/m, '<div'); // Remove any text before the first <div
    responseContent = responseContent.replace(/<\/div>[\s\S]*?$/m, '</div>'); // Remove any text after the last </div>

    // Return the cleaned response content
    return res.status(200).json({ suggestion: responseContent.trim() });
  } catch (error) {
    console.error('Error in Ollama API:', error);
    return res.status(500).json({ error: error.message });
  }
}
