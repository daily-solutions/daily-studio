import { useCallback } from 'react';
import { Asset as AssetType, useAssets } from '@/states/assetState';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function Asset({ asset }: { asset: AssetType }) {
  const [, setAssets] = useAssets();

  const handleDelete = useCallback(() => {
    setAssets((assets) => {
      const newAssets = { ...assets };
      delete newAssets[asset.name];
      return newAssets;
    });
  }, [asset.name, setAssets]);

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
