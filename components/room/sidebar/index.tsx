import { Tabs } from 'components/room/sidebar/tabs';

import { TabContent } from '@/components/room/sidebar/tabs/TabContent';
import { TabHeading } from '@/components/room/sidebar/tabs/TabHeading';

export function Sidebar() {
  return (
    <div className="h-full w-[30dvw] min-w-[30dvw] border-l 2xl:w-[25dvw] 2xl:min-w-[25dvw]">
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
