import React, { useCallback, useState } from 'react';
import { Asset as AssetType, useAssets } from '@/states/assetState';

import { useSyncAssets } from '@/hooks/useSyncParams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Asset } from '@/components/room/sidebar/assets/Asset';

export function Assets() {
  const [asset, setAsset] = useState<AssetType>({
    name: '',
    url: '',
  });

  const [assets, setAssets] = useAssets();
  const { updateAssets } = useSyncAssets();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAsset((asset) => ({ ...asset, [e.target.name]: e.target.value })),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let name = asset.name.replace(/\s+/g, '-').toLowerCase();
      if (!name.endsWith('.png')) name += '.png';

      setAssets((assets) => {
        const newAssets = {
          ...assets,
          [name]: {
            name: name,
            url: asset.url,
          },
        };
        updateAssets(newAssets);
        return newAssets;
      });
      setAsset({ name: '', url: '' });
    },
    [asset.name, asset.url, setAssets, updateAssets]
  );

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Asset Name</Label>
            <Input
              name="name"
              placeholder="Enter asset name"
              value={asset.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Asset URL</Label>
            <p className="text-xs text-muted-foreground">
              Only PNG images are supported
            </p>
            <Input
              name="url"
              placeholder="Enter your URL"
              value={asset.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </div>
      </form>
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
