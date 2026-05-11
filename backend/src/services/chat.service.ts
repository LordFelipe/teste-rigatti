import { google } from '@ai-sdk/google';
import { generateText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import Product from '../models/product';

export class ChatService {
  constructor(private readonly companyId: string) {}

  async processMessage(userMessage: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        system: `Você é um assistente virtual de e-commerce útil e educado. 
        Responda às dúvidas do cliente se baseando único e exclusivamente nos produtos retornados pela sua ferramenta de busca. 
        Se o produto não existir no banco, diga que não encontrou. Não invente dados para o pedinte.`,
        prompt: userMessage,
        stopWhen: stepCountIs(3), 
        tools: {
          searchProducts: tool({
            description: 'Busca produtos no banco de dados da empresa por nome ou categoria.',
            inputSchema: z.object({
              query: z.string().describe('Termo de busca extraído da pergunta do usuário (ex: "camisa", "eletrônicos")'),
            }),
            execute: async ({ query }) => {
              return Product.find({
                companyId: this.companyId,
                $or: [
                  { name: { $regex: query, $options: 'i' } },
                  { category: { $regex: query, $options: 'i' } }
                ]
              }).select('name description price category').limit(5).lean();
            },
          }),
        },
      });

      return text;
    } catch (error) {
        const possibleQuery = userMessage.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').sort((a,b) => b.length - a.length)[0];
      
      const localProducts = await Product.find({
        companyId: this.companyId,
        $or: [
          { name: { $regex: possibleQuery || '', $options: 'i' } },
          { category: { $regex: possibleQuery || '', $options: 'i' } }
        ]
      }).limit(3).lean();

      if (localProducts.length === 0) {
        return `[Modo de Segurança] Infelizmente minha cota de IA estourou, mas fiz uma varredura no banco e não encontrei nada para "${possibleQuery}".`;
      }

      const list = localProducts.map(p => `- ${p.name} (R$ ${p.price})`).join('\n');
      return `[Modo de Segurança] Olá! Minha cota de IA expirou agora pouco, mas busquei manualmente no banco para você e achei estes itens:\n\n${list}`;
    }
  }
}