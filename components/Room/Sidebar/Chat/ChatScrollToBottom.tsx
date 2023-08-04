import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icons';

interface Props {
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatScrollToBottom({ isAtBottom, scrollToBottom }: Props) {
  if (isAtBottom) return null;
  return (
    <div className="absolute bottom-20 right-5 z-10">
      <Button onClick={scrollToBottom} size="icon">
        <Icon icon="chevronDown" className="h-5 w-5" />
      </Button>
    </div>
  );
}
