import { useCallback } from 'react';
import { config } from '@/config';
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
    <div className="min-h-20 flex h-20 items-center justify-center border-t">
      {Object.entries(config?.options?.available_layouts).map(
        ([key, value]) => (
          <TrayButton
            key={key}
            selected={params.mode === key}
            onClick={() => handleSelect(key as any)}
            text={value}
            icon={key}
          />
        ),
      )}
    </div>
  );
}
