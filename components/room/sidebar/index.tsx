import { Tabs } from 'components/room/sidebar/tabs';

import { TabContent } from '@/components/room/sidebar/tabs/TabContent';
import { TabHeading } from '@/components/room/sidebar/tabs/TabHeading';

export function Sidebar() {
  return (
    <div className="h-full w-[35dvw] border-l">
      <div className="flex bg-background">
        <div className="flex-1">
          <TabHeading />
          <TabContent />
        </div>
        <Tabs />
      </div>
    </div>
  );
}
