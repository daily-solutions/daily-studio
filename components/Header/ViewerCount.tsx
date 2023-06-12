import { Badge } from '@/ui/Badge';

import { useParticipantCount } from '@/hooks/useParticipantCount';

import { Icons } from '../Icons';

export function ViewerCount() {
  const { hidden } = useParticipantCount();

  return (
    <Badge variant="outline" className="px-2 py-1">
      <Icons.eye className="mr-1 h-5 w-5" />
      <span className="font-bold">{hidden}</span>
      <span className="sr-only">Viewers</span>
    </Badge>
  );
}
