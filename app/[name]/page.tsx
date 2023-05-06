import { PrivilegeCard } from '@/components/room/privilege/PrivilegeCard';

export default function RoomPage({
  params: { name },
}: {
  params: { name: string };
}) {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row">
        <PrivilegeCard
          roomName={name}
          heading="Enter as producer"
          description="Join call in new tab as a meeting owner. You can configure layouts and the stream settings."
          buttonText="Join as producer"
          privilege="producer"
        />
        <PrivilegeCard
          roomName={name}
          heading="Enter as viewer"
          description="Add an owner to the room prior to adding additional participants. Select this option to join from the perspective of a participant."
          buttonText="Join as viewer"
          buttonVariant="outline"
          privilege="viewer"
        />
      </div>
      <p className="text-muted-foreground">
        We recommend joining as an producer in one tab, and adding participants
        via another browser.
      </p>
    </div>
  );
}
