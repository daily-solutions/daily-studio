import { Tile } from 'components/tile';

interface Props {
  participantIds: string[];
}
export function Participants({ participantIds }: Props) {
  return (
    <div className="flex h-36 w-full items-center gap-4">
      {participantIds.map((id) => (
        <div className="w-[calc(9rem*(16/9))]" key={id}>
          <Tile sessionId={id} noVideoTileColor="bg-background" />
        </div>
      ))}
    </div>
  );
}
