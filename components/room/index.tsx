import { Sidebar } from '@/components/room/sidebar';
import { VcsPreview } from '@/components/vcs/vcsPreview';

interface Props {
  isProducer?: boolean;
}

export function Room({ isProducer = false }: Props) {
  return (
    <div className="flex h-full w-full flex-1">
      <div className="w-full">
        <VcsPreview />
      </div>
      {isProducer && <Sidebar />}
    </div>
  );
}
