import { useCallback } from 'react';

import { Asset as AssetType } from '@/types/asset';
import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function Asset({ asset }: { asset: AssetType }) {
  const [{ assets }, setSessionState] =
    useMeetingSessionState<MeetingSessionState>();

  const handleDelete = useCallback(() => {
    const newAssets = { ...assets };
    delete newAssets[asset.name];
    setSessionState({ assets: { ...newAssets } }, 'shallow-merge');
  }, [asset.name, assets, setSessionState]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col justify-center gap-y-2">
        <h3 className="text-ellipsis text-sm font-medium">{asset.name}</h3>
        <p className="text-xs text-muted-foreground">{asset.url}</p>
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
