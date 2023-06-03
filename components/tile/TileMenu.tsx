import { ParticipantMenu } from '@/components/room/sidebar/people/ParticipantMenu';

interface Props {
  sessionId: string;
}

export function TileMenu({ sessionId }: Props) {
  return (
    <div className="absolute right-2 top-2">
      <ParticipantMenu sessionId={sessionId} variant="secondary" />
    </div>
  );
}
