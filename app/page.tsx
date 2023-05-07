import { siteConfig } from '@/config/site';
import { JoinButton } from '@/components/joinButton';

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
      <h2 className="text-2xl font-bold leading-3">{siteConfig.name}</h2>
      <p className="leading-7">{siteConfig.description}</p>
      <JoinButton />
    </div>
  );
}