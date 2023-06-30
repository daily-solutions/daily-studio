import { Icons } from '@/ui/Icons';

export function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Icons.spinner className="h-8 w-8 animate-spin" />
    </div>
  );
}
