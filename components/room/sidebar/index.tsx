import { Category } from '@/components/room/sidebar/category';
import { CategoryHeading } from '@/components/room/sidebar/category/CategoryHeading';

export function Sidebar() {
  return (
    <div className="w-[35dvw] border-l">
      <div className="flex h-full">
        <div className="flex-1 bg-muted">
          <CategoryHeading />
        </div>
        <Category />
      </div>
    </div>
  );
}
