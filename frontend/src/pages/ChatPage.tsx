import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { Bot, Loader2 } from 'lucide-react';

export function ChatPage() {
  const { messages, isTyping, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col rounded-xl border border-border/40 overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center gap-3 border-b border-border/40 bg-muted/30 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Assistente IA</h2>
          <p className="text-xs text-muted-foreground">
            Pergunte sobre produtos do catálogo
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">Olá! Como posso ajudar?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pergunte sobre produtos, preços, categorias...
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in">
            <Loader2 className="h-4 w-4 animate-spin" />
            Digitando...
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </div>
  );
}
