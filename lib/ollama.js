import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://mlwork.technofaq.org:11434' });

export const fetchOllamaResponse = async (prompt) => {
  try {
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: prompt }],
      // Aggressive tuning for faster and shorter results
      max_tokens: 30, // Reduce response length further
      temperature: 0.5, // Lower randomness for deterministic output
      top_p: 0.8, // Narrow probability for concise output
      stream: false, // Ensure single response instead of streaming
      timeout: 10000, // Set a timeout limit (in milliseconds) to avoid long waits
    });

    return response.message.content.trim(); // Clean up the result
  } catch (error) {
    console.error('Error in Ollama request:', error);
    throw new Error(`Error in fetching data: ${error.message}`);
  }
};
