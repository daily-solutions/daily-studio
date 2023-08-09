import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icons';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';
import { TrayButton } from '@/ui/TrayButton';
import { toast } from '@/ui/useToast';

import { useIsOwner } from '@/hooks/useIsOwner';

export function Invite() {
  const isOwner = useIsOwner();
  const params = useParams();

  const baseURL = useMemo(
    () => window.location.origin + '/' + params.name,
    [params],
  );

  const handleCopyToClipboard = useCallback(async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: 'Copied to clipboard' });
  }, []);

  if (!isOwner) return null;

  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <TrayButton text="Invite" icon="userPlus" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Invite as producer</Label>
            <div className="flex items-center justify-center gap-x-2">
              <Input disabled value={baseURL + '/producer'} />
              <Button
                size="auto"
                variant="outline"
                onClick={() => handleCopyToClipboard(baseURL + '/producer')}
              >
                <Icon icon="clipboard" className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Invite as presenter</Label>
            <div className="flex items-center justify-center gap-x-2">
              <Input disabled value={baseURL + '/presenter'} />
              <Button
                size="auto"
                variant="outline"
                onClick={() => handleCopyToClipboard(baseURL + '/presenter')}
              >
                <Icon icon="clipboard" className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Invite as viewer</Label>
            <div className="flex items-center justify-center gap-x-2">
              <Input disabled value={baseURL + '/viewer'} />
              <Button
                size="auto"
                variant="outline"
                onClick={() => handleCopyToClipboard(baseURL + '/viewer')}
              >
                <Icon icon="clipboard" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
