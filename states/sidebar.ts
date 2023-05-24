import { atom, useRecoilState } from 'recoil';

export type Sidebar =
  | 'layout'
  | 'text'
  | 'image'
  | 'toast'
  | 'people'
  | 'assets'
  | 'stream'
  | 'chat';

const sidebarView = atom<Sidebar>({
  key: 'sidebar-view',
  default: 'chat',
});

export const useSidebar = () => useRecoilState(sidebarView);
