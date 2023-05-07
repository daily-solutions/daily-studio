import { Sidebar } from '@/components/room/sidebar';

export function Room() {
  return (
    <div className="flex h-full w-full flex-1">
      <div className="w-full">Call</div>
      <Sidebar />
    </div>
  );
}
