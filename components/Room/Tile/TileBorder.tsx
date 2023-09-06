import { useActiveSpeakerId } from '@daily-co/daily-react';

interface Props {
  sessionId: string;
}

export function TileBorder({ sessionId }: Props) {
  const activeSpeakerId = useActiveSpeakerId();

  if (activeSpeakerId !== sessionId) return null;

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full border-2 border-primary"
      role="presentation"
    />
  );
}
