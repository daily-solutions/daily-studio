import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/components/room/sidebar/category';
import { CategoryHeading } from '@/components/room/sidebar/category/CategoryHeading';

export function Sidebar() {
  return (
    <div className="w-[35dvw] border-l">
      <div className="flex h-full">
        <div className="flex-1 bg-muted">
          <CategoryHeading />
          <ScrollArea>Hello</ScrollArea>
        </div>
        <Category />
      </div>
    </div>
  );
}
