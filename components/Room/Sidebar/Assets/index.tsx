import React, { useCallback, useState } from 'react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';

import { Asset as AssetType } from '@/types/asset';
import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { Asset } from '@/components/Room/Sidebar/Assets/Asset';

export default function Assets() {
  const [asset, setAsset] = useState<AssetType>({
    name: '',
    url: '',
  });

  const [{ assets }, setSessionState] =
    useMeetingSessionState<MeetingSessionState>();

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

      setSessionState(
        {
          assets: {
            ...assets,
            [name]: {
              name: name,
              url: asset.url,
            },
          },
        },
        'shallow-merge'
      );

      setAsset({ name: '', url: '' });
    },
    [asset.name, asset.url, assets, setSessionState]
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
      {Object.keys(assets ?? {}).length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm">Uploaded assets</h3>
          <div className="mt-4 flex flex-col space-y-4">
            {Object.keys(assets ?? {}).map((key) => (
              <Asset asset={assets?.[key]} key={key} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
