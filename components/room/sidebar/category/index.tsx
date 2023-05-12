import { CategoryTab } from '@/components/room/sidebar/category/CategoryTab';

export function Category() {
  return (
    <div className="flex flex-col items-center gap-y-2 border-l p-2">
      <CategoryTab name="layout" icon="view" text="View" />
      <CategoryTab name="text" icon="text" text="Text" />
      <CategoryTab name="image" icon="image" text="Image" />
      <CategoryTab name="toast" icon="bell" text="Toast" />
      <CategoryTab name="people" icon="people" text="People" />
      <CategoryTab name="stream" icon="stream" text="RTMP" />
      <CategoryTab name="media" icon="media" text="Media" />
      <CategoryTab name="assets" icon="files" text="Assets" />
      <CategoryTab name="settings" icon="settings" text="Config" />
    </div>
  );
}
