import { useMemo } from 'react';
import { Tabs as TabsList } from 'components/room/sidebar/tabs';

import { useIsOwner } from '@/hooks/useIsOwner';
import { Tabs } from '@/components/ui/tabs';
import { TabContent } from '@/components/room/sidebar/tabs/TabContent';

export function Sidebar() {
  const isOwner = useIsOwner();

  const defaultSidebar = useMemo(
    () => (isOwner ? 'layout' : 'chat'),
    [isOwner]
  );

  return (
    <Tabs
      orientation="vertical"
      defaultValue={defaultSidebar}
      className="hidden h-full w-[400px] border-l md:block"
    >
      <div className="flex bg-background">
        <div className="flex-1">
          <TabContent value="layout" />
          <TabContent value="text" />
          <TabContent value="image" />
          <TabContent value="toast" />
          <TabContent value="chat" />
          <TabContent value="people" />
          <TabContent value="stream" />
          <TabContent value="assets" />
          <TabContent value="config" />
        </div>
        <TabsList />
      </div>
    </Tabs>
  );
}
