import { useMemo } from 'react';
import { Tabs } from '@/ui/Tabs';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';
import { Tabs as TabsList } from '@/components/Room/Sidebar/Tabs';
import { TabContent } from '@/components/Room/Sidebar/Tabs/TabContent';

interface Props {
  visibleInMobile?: boolean;
}

export function Sidebar({ visibleInMobile = false }: Props) {
  const isOwner = useIsOwner();
  const isMobile = useIsMobile();

  const defaultSidebar = useMemo(
    () => (isOwner ? 'layout' : 'chat'),
    [isOwner],
  );

  if (isMobile && !visibleInMobile) return null;

  return (
    <Tabs
      orientation={isMobile ? 'horizontal' : 'vertical'}
      defaultValue={defaultSidebar}
      className="h-full w-full md:w-[400px] md:border-l"
    >
      <div className="flex flex-col bg-background md:flex-row">
        <div className="order-1 flex-1 md:order-none md:w-[calc(100%-4rem)]">
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
