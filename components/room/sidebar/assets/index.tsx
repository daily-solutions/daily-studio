import { useCallback } from 'react';
import { useAssets } from '@/states/assetState';

import { useSyncAssets } from '@/hooks/useSyncParams';
import { Icons } from '@/components/icons';
import { Asset } from '@/components/room/sidebar/assets/Asset';

export function Assets() {
  const [assets, setAssets] = useAssets();
  const { updateAssets } = useSyncAssets();

  const handleUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      const fileKey = file.name.replace(/\s+/g, '-').toLowerCase();

      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await response.json();

      setAssets((assets) => {
        const newAssets = {
          ...assets,
          [fileKey]: {
            id: fileKey,
            name: file.name.replace(/\s/g, ''),
            url: encodeURI(data.url),
            size: file.size,
          },
        };
        updateAssets(newAssets);
        return newAssets;
      });
    },
    [setAssets, updateAssets]
  );

  return (
    <div className="p-4">
      <div className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-y-4 rounded-md bg-muted py-8">
        <div className="w-30 h-30 rounded-full bg-background p-4">
          <Icons.upload className="h-5 w-5" />
        </div>
        <p className="text-sm">Browse or drag a file here</p>
        <input
          className="absolute left-0 top-0 h-full w-full opacity-0"
          type="file"
          onChange={handleUpload}
          accept="image/png"
        />
      </div>
      {Object.keys(assets).length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm">Uploaded assets</h3>
          <div className="mt-4 flex flex-col space-y-4">
            {Object.keys(assets).map((key) => (
              <Asset asset={assets[key]} key={key} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
