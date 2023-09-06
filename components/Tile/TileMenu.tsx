import { ParticipantMenu } from '@/components/Room/Sidebar/People/ParticipantMenu/ParticipantMenu';
import { VisibilityMenu } from '@/components/Tile/VisibilityMenu';

interface Props {
  sessionId: string;
}

export function TileMenu({ sessionId }: Props) {
  return (
    <div className="absolute right-2 top-2">
      <VisibilityMenu sessionId={sessionId} />
      <ParticipantMenu sessionId={sessionId} variant="secondary" />
    </div>
  );
}
