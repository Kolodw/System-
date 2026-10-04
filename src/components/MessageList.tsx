import React, { useEffect, useRef } from 'react';
import { ChatMessage, ThemeMode } from '../types';
import { MessageBubble } from './MessageBubble';
import { Loader2, Sparkles } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSelectAction: (actionText: string) => void;
  themeMode?: ThemeMode;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  onSelectAction,
  themeMode = 'dark',
}) => {
  const isWhite = themeMode === 'white';
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-2">
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLatest={index === messages.length - 1}
          onSelectAction={onSelectAction}
          themeMode={themeMode}
        />
      ))}

      {isStreaming && (
        <div
          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-mono w-fit animate-pulse ${
            isWhite
              ? 'bg-white/95 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-slate-900/60 border-indigo-500/20 text-indigo-300'
          }`}
        >
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          <span>Game Master &amp; The System กำลังเรียบเรียงเหตุการณ์...</span>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};
