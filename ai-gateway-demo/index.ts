import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Vercel AI Gateway creates a specific endpoint you can use.
// Typically it looks like https://api.openai.com/v1 but routed through gateway.
// We configure the custom baseURL for OpenAI pointing to the gateway (or Vercel's standard AI SDK behavior)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  baseURL: 'https://gateway.ai.cloudflare.com/v1/.../openai', // Placeholder URL for Gateway if needed
  // Alternatively, if you use Vercel AI Gateway, it might look like:
  // baseURL: 'https://pro.api.openai.com/v1' 
  // For Vercel AI Gateway specifically, you might use fetch overrides or the gateway ID.
});

async function main() {
  console.log('Iniciando stream com AI Gateway...');
  
  try {
    const { textStream, usage } = streamText({
      model: openai('gpt-5.4'),
      prompt: 'Olá! Escreva um pequeno poema sobre gateways de IA.',
    });

    for await (const textPart of textStream) {
      process.stdout.write(textPart);
    }
    
    console.log('\n\n--- Uso de Tokens ---');
    const tokenUsage = await usage;
    console.log(`Prompt Tokens: ${tokenUsage.promptTokens}`);
    console.log(`Completion Tokens: ${tokenUsage.completionTokens}`);
    console.log(`Total Tokens: ${tokenUsage.totalTokens}`);

  } catch (error) {
    console.error('\nErro ao executar o modelo:', error);
  }
}

main();
