import { useCallback } from 'react';
import { RTMP, useRTMP } from '@/states/rtmpState';

import { useSyncRTMPs } from '@/hooks/useSyncParams';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function Rtmp({ rtmp, id }: { rtmp: RTMP; id: string }) {
  const [, setRTMPs] = useRTMP();
  const { updateRTMPs } = useSyncRTMPs();

  const handleDelete = useCallback(() => {
    setRTMPs((r) => {
      const newRTMPs = { ...r };
      delete newRTMPs[id];

      updateRTMPs(newRTMPs);
      return newRTMPs;
    });
  }, [id, setRTMPs, updateRTMPs]);

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-sm font-medium">{rtmp.platform}</h3>
        <p className="text-xs">{rtmp.streamURL}</p>
      </div>
      <Button
        size="auto"
        variant="outline"
        className="text-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
        onClick={handleDelete}
      >
        <Icons.trash className="h-5 w-5" />
      </Button>
    </div>
  );
}
