import { useCallback } from 'react';
import { useParams } from '@/states/params';
import {
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

export function Layout() {
  const localSessionId = useLocalSessionId();
  const isOwner = useParticipantProperty(localSessionId, 'owner');
  const [params, setParams] = useParams();

  const handleSelect = useCallback(
    (mode: 'single' | 'split' | 'grid' | 'dominant' | 'pip') =>
      setParams((params) => ({ ...params, mode })),
    [setParams]
  );

  if (!isOwner) return null;

  return (
    <div className="flex">
      <TrayButton
        selected={params.mode === 'single'}
        onClick={() => handleSelect('single')}
        text="Single"
        icon="single"
      />
      <TrayButton
        selected={params.mode === 'split'}
        onClick={() => handleSelect('split')}
        text="Split"
        icon="split"
      />
      <TrayButton
        selected={params.mode === 'grid'}
        onClick={() => handleSelect('grid')}
        text="Grid"
        icon="grid"
      />
      <TrayButton
        selected={params.mode === 'dominant'}
        onClick={() => handleSelect('dominant')}
        text="Speaker"
        icon="dominant"
      />
      <TrayButton
        selected={params.mode === 'pip'}
        onClick={() => handleSelect('pip')}
        text="PiP"
        icon="pip"
      />
    </div>
  );
}
