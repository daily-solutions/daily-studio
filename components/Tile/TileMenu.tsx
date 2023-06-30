import { ParticipantMenu } from '@/components/Room/Sidebar/People/ParticipantMenu';

interface Props {
  sessionId: string;
}

export default function TileMenu({ sessionId }: Props) {
  return (
    <div className="absolute right-2 top-2">
      <ParticipantMenu sessionId={sessionId} variant="secondary" />
    </div>
  );
}
