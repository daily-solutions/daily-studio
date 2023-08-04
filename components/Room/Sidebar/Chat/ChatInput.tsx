import React, { useCallback, useState } from 'react';
import { useMessages } from '@/states/messagesState';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';
import { Textarea } from '@/ui/TextArea';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

export function ChatInput() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const userName = useParticipantProperty(localSessionId, 'user_name');
  const [, setMessages] = useMessages();

  const [message, setMessage] = useState('');

  const sendAppMessage = useCallback(() => {
    if (!daily || !localSessionId || !message) return;

    const id = crypto.randomUUID();

    daily.sendAppMessage({
      event: 'message',
      id,
      userName,
      message,
    });

    setMessages((messages) => [
      ...messages,
      {
        id,
        userName,
        message,
        receivedAt: new Date(),
        fromId: localSessionId,
        isLocal: true,
      },
    ]);
    setMessage('');
  }, [daily, localSessionId, setMessages, userName, message]);

  const handleKeyDown = useCallback(
    (ev: React.KeyboardEvent) => {
      if (
        ev.key === 'Enter' &&
        !(ev.shiftKey || ev.altKey || ev.ctrlKey || ev.metaKey)
      ) {
        ev.preventDefault();
        sendAppMessage();
      }
    },
    [sendAppMessage]
  );

  return (
    <div className="w-full pb-4">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          sendAppMessage();
        }}
      >
        <div className="relative">
          <Textarea
            autoGrow
            onKeyDown={handleKeyDown}
            value={message}
            rows={1}
            onChange={(ev) => setMessage(ev.target.value)}
            name="message"
            className="resize-none py-3 pr-10"
            placeholder="Enter your message here"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button
              disabled={!message}
              type="submit"
              size="auto"
              variant="ghost"
            >
              <Icons.send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
