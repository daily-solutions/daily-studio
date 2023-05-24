import { Category } from '@/components/room/sidebar/category';
import { CategoryContent } from '@/components/room/sidebar/category/CategoryContent';
import { CategoryHeading } from '@/components/room/sidebar/category/CategoryHeading';

export function Sidebar() {
  return (
    <div className="h-full w-[35dvw] border-l">
      <div className="flex bg-background">
        <div className="flex-1">
          <CategoryHeading />
          <CategoryContent />
        </div>
        <Category />
      </div>
    </div>
  );
}
