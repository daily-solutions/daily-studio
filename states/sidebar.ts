import { useMemo } from 'react';
import { SetterOrUpdater, atom, useRecoilState } from 'recoil';

import { useIsOwner } from '@/hooks/useIsOwner';

export type Sidebar =
  | 'layout'
  | 'text'
  | 'image'
  | 'toast'
  | 'people'
  | 'assets'
  | 'stream'
  | 'chat'
  | 'settings';

const VIEWER_SIDEBAR = ['chat', 'settings'];

const sidebarView = atom<Sidebar>({
  key: 'sidebar-view',
  default: 'layout',
});

export const useSidebar = (): [Sidebar, SetterOrUpdater<Sidebar>] => {
  const isOwner = useIsOwner();
  const [sidebar, setSidebar] = useRecoilState(sidebarView);

  const defaultSidebar = useMemo(() => {
    if (isOwner) return sidebar;

    return VIEWER_SIDEBAR.includes(sidebar) ? sidebar : 'chat';
  }, [isOwner, sidebar]);

  return [defaultSidebar, setSidebar];
};
