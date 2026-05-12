'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGiantResponse } from '@/lib/gemini';
import GiantAvatar from '@/components/GiantAvatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIGiantChatProps {
  giantName: string;
  persona: string;
  slug: string;
  category: string;
}

const AIGiantChat: React.FC<AIGiantChatProps> = ({ giantName, slug, category }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGiantResponse('', input, giantName);
      const aiMsg: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-16 glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      <div className="p-6 border-b border-gold-antique/20 bg-navy-light/50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-antique/30 bg-navy-dark flex-shrink-0">
          <GiantAvatar slug={slug} category={category} size={48} />
        </div>
        <div>
          <h3 className="font-serif text-gold-antique text-xl">{giantName}</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gold-antique/20">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
            <p className="font-serif italic text-lg text-slate-300">
              &quot;{giantName}에게 당신의 고민을 털어놓으세요.&quot;
            </p>
            <p className="text-xs text-slate-500">위인의 철학이 담긴 특별한 조언이 기다립니다.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-antique/20 bg-navy-dark flex-shrink-0 mt-1">
                  <GiantAvatar slug={slug} category={category} size={32} />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-gold-antique text-navy-dark font-medium rounded-tr-none' 
                : 'bg-navy-light/80 text-slate-100 border border-gold-antique/10 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-start gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-antique/20 bg-navy-dark flex-shrink-0 mt-1">
              <GiantAvatar slug={slug} category={category} size={32} />
            </div>
            <div className="bg-navy-light/80 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 border border-gold-antique/10">
              <Loader2 className="animate-spin text-gold-antique" size={18} />
              <span className="text-xs text-slate-400 font-serif italic">거인이 생각하는 중입니다...</span>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-navy-dark/50 border-t border-gold-antique/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="어떤 고민이 있으신가요?"
            className="w-full bg-navy-light/50 border border-gold-antique/20 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-gold-antique/50 transition-all text-slate-200"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold-antique hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIGiantChat;
