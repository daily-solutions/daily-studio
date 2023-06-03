import { Tile } from 'components/tile';

import { EmptyState } from '@/components/ui/empty-state';

interface Props {
  participantIds: string[];
}
export function Participants({ participantIds }: Props) {
  if (participantIds.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <EmptyState icon="people" title="No participants in the waiting list" />
      </div>
    );
  }

  return (
    <div className="flex h-36 items-center gap-x-4 overflow-x-scroll">
      {participantIds.map((id) => (
        <div className="w-[calc(9rem*(16/9))]" key={id}>
          <Tile sessionId={id} noVideoTileColor="bg-background" showMenu />
        </div>
      ))}
    </div>
  );
}
