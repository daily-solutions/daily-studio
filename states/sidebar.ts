import { atom, useRecoilState } from 'recoil';

export type Sidebar =
  | 'layout'
  | 'text'
  | 'image'
  | 'toast'
  | 'people'
  | 'assets'
  | 'stream';

const sidebarView = atom<Sidebar>({
  key: 'sidebar-view',
  default: 'layout',
});

export const useSidebar = () => useRecoilState(sidebarView);
