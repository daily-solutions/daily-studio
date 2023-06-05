import { Button } from '@/components/ui/button';
import { Icon, Icons } from '@/components/icons';

interface Props {
  text: string;
  icon: keyof typeof Icons;
  onClick?: () => void;
  muted?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export function TrayButton({
  text,
  icon,
  onClick,
  muted,
  selected,
  disabled = false,
}: Props) {
  return (
    <Button
      variant="ghost"
      size="trayButton"
      onClick={onClick}
      className={
        muted ? 'text-destructive' : selected ? 'text-selected' : 'text-inherit'
      }
      disabled={disabled}
    >
      <div className="flex flex-col items-center justify-center gap-y-1">
        <Icon icon={icon} className="h-6 w-6" />
        <p className="text-xs">{text}</p>
      </div>
    </Button>
  );
}
