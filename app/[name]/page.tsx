import { siteConfig } from '@/config/site';
import { Header } from '@/components/header';
import { PrivilegeCard } from '@/components/room/privilege/PrivilegeCard';

export default function RoomPage({
  params: { name },
}: {
  params: { name: string };
}) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-y-6">
        <h2 className="text-2xl font-bold leading-3">{siteConfig.name}</h2>
        <p className="leading-7">{siteConfig.description}</p>
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row">
          <PrivilegeCard
            roomName={name}
            heading="Producer"
            description="Join call in new tab as a meeting owner. You can configure layouts and the stream settings."
            buttonText="Join as producer"
            privilege="producer"
          />
          <PrivilegeCard
            roomName={name}
            heading="Presenter"
            description="Add an owner to the room prior to adding additional participants. Select this option to join from the perspective of a presenter."
            buttonVariant="secondary"
            buttonText="Join as presenter"
            privilege="presenter"
          />
          <PrivilegeCard
            roomName={name}
            heading="Viewer"
            description="Add an owner to the room prior to adding additional participants. Select this option to join from the perspective of a participant."
            buttonText="Join as viewer"
            buttonVariant="outline"
            privilege="viewer"
          />
        </div>
        <p className="text-muted-foreground">
          We recommend joining as an producer in one tab, and adding
          participants via another browser.
        </p>
      </div>
    </div>
  );
}
