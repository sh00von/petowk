import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://mlwork.technofaq.org:11434' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { pet } = req.body;

  // Construct the prompt for food suggestion
  const prompt = `You are a pet nutrition expert. Please suggest appropriate foods for ${pet} categorized by age group. For each age group, include recommended food types, nutritional breakdown (vitamins, minerals, proteins, fats).`;

  try {
    // Make a request to the Ollama client
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });

    const foodSuggestion = response.message.content;

    // Send the food suggestion as the API response
    res.status(200).json({
      suggestion: foodSuggestion,
      prompt_heading: `Pet Food Suggestions for ${pet}`,
    });
  } catch (error) {
    console.error("Error in fetching data:", error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}
