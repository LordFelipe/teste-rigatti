import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

export class ChatController {
  static async handleChat(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ message: 'A mensagem é obrigatória.' });
        return;
      }

      const service = new ChatService((req as any).user!.companyId);
      const response = await service.processMessage(message);

      res.status(200).json({ reply: response });
    } catch (error: any) {
      console.error('Erro no chat:', error);
      res.status(500).json({ message: 'Erro ao processar a mensagem com a IA.' });
    }
  }
}