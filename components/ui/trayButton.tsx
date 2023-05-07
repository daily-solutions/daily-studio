import { Button } from '@/components/ui/button';
import { Icon, Icons } from '@/components/icons';

interface Props {
  text: string;
  icon: keyof typeof Icons;
  onClick?: () => void;
  muted?: boolean;
}

export function TrayButton({ text, icon, onClick, muted }: Props) {
  return (
    <Button
      variant="ghost"
      size="trayButton"
      onClick={onClick}
      className={muted ? 'text-destructive' : 'text-inherit'}
    >
      <div className="flex flex-col items-center justify-center gap-y-1">
        <Icon icon={icon} className="h-6 w-6" />
        <p className="text-xs">{text}</p>
      </div>
    </Button>
  );
}