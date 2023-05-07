import { CategoryTab } from '@/components/room/sidebar/category/CategoryTab';

export function Category() {
  return (
    <div className="flex flex-col items-center gap-y-2 border-l p-2">
      <CategoryTab name="layout" icon="view" text="View" />
      <CategoryTab name="text" icon="text" text="Text" />
      <CategoryTab name="image" icon="image" text="Image" />
      <CategoryTab name="toast" icon="bell" text="Toast" />
      <CategoryTab name="people" icon="people" text="People" />
      <CategoryTab name="assets" icon="files" text="Assets" />
    </div>
  );
}
