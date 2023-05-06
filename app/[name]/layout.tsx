import '@/styles/globals.css';
import { siteConfig } from '@/config/site';

interface RoomLayoutProps {
  children: React.ReactNode;
}

export default function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-4">
      <h2 className="text-2xl font-bold leading-3">{siteConfig.name}</h2>
      <p className="leading-7">{siteConfig.description}</p>
      {children}
    </div>
  );
}
