import { Ollama } from 'ollama';

// Access the host URL from the environment variable
const ollamaHost = process.env.NEXT_PUBLIC_OLLAMA_HOST;

// Initialize the Ollama client
const ollama = new Ollama({ host: ollamaHost });

export const fetchOllamaResponse = async (prompt) => {
  try {
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 30, // Short response
      temperature: 0.5, // Low randomness
      top_p: 0.8, // Narrow probability
      stream: false, // Single response
      timeout: 10000, // Timeout in milliseconds
    });

    return response.message.content.trim();
  } catch (error) {
    console.error('Error in Ollama request:', error);
    throw new Error(`Error in fetching data: ${error.message}`);
  }
};
