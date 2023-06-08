import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { useIsOwner } from '@/hooks/useIsOwner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { Icon } from '@/components/icons';

export function Invite() {
  const isOwner = useIsOwner();
  const params = useParams();

  const baseURL = useMemo(
    () => window.location.origin + '/' + params.name,
    [params]
  );

  const handleCopyToClipboard = useCallback(async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: 'Copied to clipboard' });
  }, []);

  if (!isOwner) return null;

  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="userPlus" className="h-6 w-6" />
            <p className="text-xs">Invite</p>
          </div>
        </Button>
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
