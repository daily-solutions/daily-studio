import { EmptyState } from '@/ui/EmptyState';

import { Tile } from '@/components/Tile';

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
    <div className="flex items-center gap-x-4">
      {participantIds.map((id) => (
        <div className="h-36 w-64" key={id}>
          <Tile sessionId={id} noVideoTileColor="bg-background" showMenu />
        </div>
      ))}
    </div>
  );
}
