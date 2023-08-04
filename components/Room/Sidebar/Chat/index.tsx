import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMessages } from '@/states/messagesState';
import { EmptyState } from '@/ui/EmptyState';

import { ChatInput } from '@/components/Room/Sidebar/Chat/ChatInput';
import { ChatMessage } from '@/components/Room/Sidebar/Chat/ChatMessage';
import { ChatScrollToBottom } from '@/components/Room/Sidebar/Chat/ChatScrollToBottom';

export function Chat() {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages] = useMessages();
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const handleScroll = useCallback(() => {
    const chatContainer = messagesRef.current;
    if (!chatContainer) return;

    const isAtBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop - 20 <=
      chatContainer.clientHeight;
    setShouldScrollToBottom(isAtBottom);
  }, [messagesRef]);

  const handleScrollToBottom = useCallback(() => {
    if (!messagesRef.current) return;

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    if (!shouldScrollToBottom) return;

    handleScrollToBottom();
  }, [handleScrollToBottom, messages, shouldScrollToBottom]);

  return (
    <div className="relative flex h-full flex-col justify-between gap-y-4 px-4 py-0">
      <div
        ref={messagesRef}
        className="flex max-h-[calc(100%-4rem)] flex-col overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
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
      <ChatScrollToBottom
        isAtBottom={shouldScrollToBottom}
        scrollToBottom={handleScrollToBottom}
      />
      <ChatInput />
    </div>
  );
}
