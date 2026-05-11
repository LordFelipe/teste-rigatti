import { useState, useCallback, useRef } from 'react';
import { chatApi } from '@/api/chat';
import type { ChatMessage } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const idCounter = useRef(0);

  const nextId = () => String(++idCounter.current);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const { data } = await chatApi.sendMessage(content);

      const aiMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isTyping, sendMessage, clearMessages };
}
