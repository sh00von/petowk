import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://mlwork.technofaq.org:11434' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { pet, symptom } = req.body;

  // Construct the prompt for AI veterinary suggestions
  const prompt = `You are a compassionate veterinarian assistant. For ${pet} experiencing the following symptoms: "${symptom}", provide possible health concerns or diagnoses, and recommend any steps or treatments to address these issues.`;

  try {
    // Make a request to the Ollama client
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });

    const vetSuggestion = response.message.content;

    // Send the AI vet suggestions as the API response
    res.status(200).json({
      suggestion: vetSuggestion,
      prompt_heading: `AI Vet Suggestions for ${pet}`,
    });
  } catch (error) {
    console.error("Error in fetching data:", error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}
