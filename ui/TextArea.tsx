import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { useForwardRef } from '@/hooks/useForwardRef';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoGrow?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, autoGrow = false, ...props }, ref) => {
    const [height, setHeight] = useState('auto');
    const textAreaRef = useForwardRef<HTMLTextAreaElement>(ref);

    useEffect(() => {
      if (!autoGrow || !textAreaRef.current) return;

      if (!value) {
        setHeight('auto');
      } else {
        setHeight(
          `${
            textAreaRef.current.scrollHeight +
            (textAreaRef.current.offsetHeight -
              textAreaRef.current.clientHeight)
          }px`
        );
      }
    }, [autoGrow, textAreaRef, value]);

    return (
      <textarea
        className={cn(
          'min-h-10 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={textAreaRef}
        value={value}
        {...props}
        style={{
          height,
          ...props.style,
        }}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
