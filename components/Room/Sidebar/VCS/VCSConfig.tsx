import React, { useCallback, useMemo, useState } from 'react';
import { config as vcsConfig } from '@/config';
import { useParams } from '@/states/params';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import { useToast } from '@/ui/useToast';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { slugify } from '@/lib/slugify';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';

export function VCSConfig() {
  const [name, setName] = useState('');

  const { toast } = useToast();

  const [params] = useParams();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const config = useMemo(() => ({ params, assets }), [params, assets]);

  const handleSave = useCallback(() => {
    const ilsConfig = localStorage.getItem('ils-config');
    let parsedConfig = {};

    if (ilsConfig) parsedConfig = JSON.parse(ilsConfig);

    parsedConfig = {
      ...parsedConfig,
      [slugify(name)]: {
        name,
        config,
      },
    };

    localStorage.setItem('ils-config', JSON.stringify(parsedConfig));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: 'Saved configuration',
      description: 'Configuration is saved in local storage',
    });
    setName('');
  }, [config, name, toast]);

  const isDisabled = useMemo(
    () =>
      !name ||
      dequal(params, vcsConfig.vcs) ||
      Object.keys(params).length === 0,
    [name, params],
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          placeholder="Enter name for the config"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label>Config</Label>
        <pre className="overflow-auto rounded-md bg-muted p-2 font-mono text-xs">
          {JSON.stringify(config, null, 1)}
        </pre>
      </div>
      <Button disabled={isDisabled} size="sm" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
