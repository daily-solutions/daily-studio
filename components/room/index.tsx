import { Sidebar } from '@/components/room/sidebar';

interface Props {
  isProducer?: boolean;
}

export function Room({ isProducer = false }: Props) {
  return (
    <div className="flex h-full w-full flex-1">
      <div className="w-full">Call</div>
      {isProducer && <Sidebar />}
    </div>
  );
}
