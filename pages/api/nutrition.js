import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://mlwork.technofaq.org:11434' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { pet, food } = req.body;

  // Ensure that pet and food are provided
  if (!pet || !food) {
    return res.status(400).json({ error: "Pet name and food name are required" });
  }

  // Construct the prompt to get the nutritional value for the given food
  const prompt = `You are a knowledgeable pet nutritionist. Please describe the nutritional value of the food "${food}" for a "${pet}" including details about vitamins, minerals, protein content, fats, and other important nutritional factors based on the pet's age, breed, and dietary needs.`;

  try {
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });

    const nutritionDetails = response.message.content;

    // Send the nutritional details as the API response
    res.status(200).json({
      nutrition: nutritionDetails,
      prompt_heading: `Nutritional Value for ${food} for ${pet}`,
    });
  } catch (error) {
    console.error("Error in fetching data:", error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}

