import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://mlwork.technofaq.org:11434' });

const fetchOllamaResponse = async (prompt) => {
  try {
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.message.content;
  } catch (error) {
    throw new Error(`Error in fetching data: ${error.message}`);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { pet, symptom, food } = req.body;

  if (!pet || (typeof pet !== 'string') || (!symptom && !food)) {
    return res.status(400).json({ error: 'Invalid input: Provide a valid pet type and at least one of symptom or food.' });
  }

  let prompt = '';

  if (symptom) {
    prompt = `As a vet assistant, provide possible health concerns and treatments for a ${pet} with symptoms: "${symptom}".`;
  } else if (food) {
    prompt = `Describe the nutritional value of "${food}" for a ${pet}, including key nutrients like protein, fats, vitamins, and minerals.`;
  } else {
    prompt = `Suggest suitable foods for a ${pet}, categorized by age, with nutritional breakdown (protein, fats, vitamins, minerals).`;
  }

  try {
    const responseContent = await fetchOllamaResponse(prompt);
    res.status(200).json({
      suggestion: responseContent,
      prompt_heading: symptom
        ? `AI Vet Suggestions for ${pet}`
        : food
        ? `Nutritional Value for ${food} for ${pet}`
        : `Pet Food Suggestions for ${pet}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
