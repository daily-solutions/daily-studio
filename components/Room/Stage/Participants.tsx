import { useCallback, useRef } from 'react';
import { EmptyState } from '@/ui/EmptyState';
import { useVirtual } from '@tanstack/react-virtual';

import { cn } from '@/lib/utils';
import { Tile } from '@/components/Tile';

interface Props {
  participantIds: string[];
}
export function Participants({ participantIds }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtual = useVirtual({
    parentRef,
    horizontal: true,
    size: participantIds.length,
    overscan: 5,
    estimateSize: useCallback(() => 280, []),
  });

  if (participantIds.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <EmptyState icon="people" title="No participants in the waiting list" />
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex h-full w-full items-center gap-x-4 overflow-x-auto"
    >
      <div className={cn('relative h-full', `w-[${virtual.totalSize}px]`)}>
        {virtual.virtualItems.map((virtualColumn) => (
          <div
            key={virtualColumn.index}
            className="p-1"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${virtualColumn.size}px`,
              transform: `translateX(${virtualColumn.start}px)`,
            }}
          >
            <Tile
              sessionId={participantIds[virtualColumn.index]}
              noVideoTileColor="bg-background"
              showMenu
            />
          </div>
        ))}
      </div>
    </div>
  );
}
