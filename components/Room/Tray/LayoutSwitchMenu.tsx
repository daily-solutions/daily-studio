import { useCallback } from 'react';
import { useParams } from '@/states/params';
import { TrayButton } from '@/ui/TrayButton';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useSyncParams } from '@/hooks/useSyncParams';

export function LayoutSwitchMenu() {
  const isOwner = useIsOwner();
  const [params] = useParams();
  const { updateParams } = useSyncParams();

  const handleSelect = useCallback(
    (mode: 'single' | 'split' | 'grid' | 'dominant' | 'pip') =>
      updateParams({ mode }),
    [updateParams],
  );

  if (!isOwner) return null;

  return (
    <div className="min-h-20 flex h-20 max-h-20 items-center justify-center border-t">
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
