import React, { useCallback, useState } from 'react';
import { useCreateRTMP } from '@/states/createRTMPState';
import { useRTMP } from '@/states/rtmpState';

import { useSyncRTMPs } from '@/hooks/useSyncParams';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PLATFORMS = {
  Youtube: 'rtmp://a.rtmp.youtube.com/live2/',
  Facebook: 'rtmps://live-api-s.facebook.com:443/rtmp/',
  Mux: 'rtmps://global-live.mux.com:443/app/',
  'Live Peer': 'rtmp://mdw-rtmp.livepeer.com/live/',
  Cloudflare: 'rtmps://live.cloudflare.com:443/live/',
  Custom: '',
};

const initialValues = {
  name: 'Custom',
  platform: '',
  streamURL: '',
  streamKey: '',
  active: true,
};

export function RTMPModal() {
  const [show, setShow] = useCreateRTMP();

  const [, setRTMPs] = useRTMP();
  const [currentPlatform, setCurrentPlatform] = useState(initialValues);

  const { updateRTMPs } = useSyncRTMPs();

  const handlePlatformChange = (value: string) => {
    setCurrentPlatform((cp) => ({
      ...cp,
      name: value,
      platform: value,
      streamURL: PLATFORMS[value],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPlatform((cr) => ({ ...cr, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const uuid = crypto.randomUUID();
      setRTMPs((r) => {
        const newRTMPs = { ...r, [uuid]: currentPlatform };
        updateRTMPs(newRTMPs);
        return newRTMPs;
      });
      setCurrentPlatform(initialValues);
      setShow(false);
    },
    [currentPlatform, setRTMPs, setShow, updateRTMPs]
  );

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create RTMP Destination</DialogTitle>
          <DialogDescription>
            Add a new RTMP destination to broadcast the stream.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Select RTMP destination</Label>
              <Select
                value={currentPlatform.name}
                onValueChange={handlePlatformChange}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your RTMP destination platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PLATFORMS).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currentPlatform.name === 'Custom' && (
              <div className="flex flex-col gap-y-2">
                <Label>Platform Name</Label>
                <Input
                  name="platform"
                  placeholder="Enter platform name"
                  value={currentPlatform.platform}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {currentPlatform.name === 'Custom' && (
              <div className="flex flex-col gap-y-2">
                <Label>Stream URL</Label>
                <Input
                  name="streamURL"
                  placeholder="Enter your stream url"
                  value={currentPlatform.streamURL}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <Label>Stream key</Label>
              <Input
                name="streamKey"
                placeholder="Enter your stream key"
                value={currentPlatform.streamKey}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" className="w-full">
                Save
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}