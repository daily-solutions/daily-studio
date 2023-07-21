import React, { useEffect, useRef } from 'react';
import { useMessages } from '@/states/messagesState';
import { EmptyState } from '@/ui/EmptyState';

import { ChatInput } from '@/components/Room/Sidebar/Chat/ChatInput';
import { ChatMessage } from '@/components/Room/Sidebar/Chat/ChatMessage';

export function Chat() {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages] = useMessages();

  useEffect(() => {
    const messageEl = messagesRef.current;
    if (!messageEl) return;

    messageEl.scrollTop = messageEl?.scrollHeight;
  }, [messages]);

  return (
    <div className="relative flex h-full flex-col justify-between gap-y-4 px-4 py-0">
      <div
        ref={messagesRef}
        className="flex max-h-[calc(100%-4rem)] flex-col overflow-y-auto"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <ChatMessage
              message={message}
              sameSender={message.fromId === messages?.[index - 1]?.fromId}
              key={message.id}
            />
          ))
        ) : (
          <EmptyState
            className="mt-4"
            icon="chat"
            title="It's empty in here!"
            description="Would you like to say something?"
          />
        )}
      </div>
      <ChatInput />
    </div>
  );
}
