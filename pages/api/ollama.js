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

  // Construct the prompt with improved Tailwind-styled HTML formatting
  if (symptom) {
    prompt = `Provide a concise health analysis for a ${pet} with symptoms: "${symptom}". Respond in HTML format using Tailwind classes:

<div class="bg-white my-4 space-y-6">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Health Analysis for ${pet}</h2>
  
  <div class="bg-blue-50 rounded-md p-4 space-y-4">
    <h3 class="text-xl font-semibold text-blue-700">Possible Causes</h3>
    <ul class="list-disc list-inside text-gray-700 space-y-2">
      <li>List possible causes (each in a separate li tag)</li>
    </ul>
  </div>

  <div class="bg-green-50 rounded-md p-4 space-y-4">
    <h3 class="text-xl font-semibold text-green-700">Advice for Pet Owners</h3>
    <ul class="list-disc list-inside text-gray-700 space-y-2">
      <li>Provide advice in bullet points (each in a separate li tag)</li>
    </ul>
  </div>

  <p class="text-sm text-gray-500 mt-4">Note: This analysis is for informational purposes only. Always consult with a veterinarian for proper diagnosis and treatment.</p>
</div>`;
  } else if (food) {
    prompt = `Suggest 3-4 foods for a ${pet} based on "${food}". Respond in HTML format using Tailwind classes:

<div class="bg-white my-4 space-y-6">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Food Recommendations for ${pet}</h2>
  
  <div class="bg-green-50 rounded-md p-4 space-y-4">
    <h3 class="text-xl font-semibold text-green-700">Recommended Foods</h3>
    <ul class="list-none text-gray-700 space-y-4">
      <li class="bg-white p-3 rounded shadow-sm">
        <span class="font-medium text-green-600">Food Name</span>
        <p class="mt-1 text-sm">Short description of nutritional benefits</p>
      </li>
      <!-- Repeat the above li structure for each food recommendation -->
    </ul>
  </div>

  <p class="text-sm text-gray-500 mt-4">Note: Always introduce new foods gradually and consult with a veterinarian about your pet's specific dietary needs.</p>
</div>`;
  } else if (nutrition) {
    prompt = `Provide nutritional advice for a ${pet} regarding: "${nutrition}". Respond in HTML format using Tailwind classes:

<div class="bg-white my-4 space-y-6">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Nutritional Advice for ${pet}</h2>
  
  <div class="bg-purple-50 rounded-md p-4 space-y-4">
    <h3 class="text-xl font-semibold text-purple-700">Dietary Recommendations</h3>
    <ul class="list-none text-gray-700 space-y-4">
      <li class="bg-white p-3 rounded shadow-sm">
        <span class="font-medium text-purple-600">Recommendation</span>
        <p class="mt-1 text-sm">Explanation of benefits and implementation</p>
      </li>
      <!-- Repeat the above li structure for each dietary recommendation -->
    </ul>
  </div>

  <div class="bg-yellow-50 rounded-md p-4 mt-4">
    <h4 class="text-lg font-semibold text-yellow-700 mb-2">Important Considerations</h4>
    <p class="text-sm text-gray-700">Include any specific considerations or precautions related to the nutritional advice.</p>
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

    // Clean up the response
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

