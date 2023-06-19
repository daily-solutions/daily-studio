import { atom, useRecoilState } from 'recoil';

const mobileSidebarState = atom<boolean>({
  key: 'mobile-sidebar-state',
  default: false,
});

export const useMobileSidebar = () => useRecoilState(mobileSidebarState);
