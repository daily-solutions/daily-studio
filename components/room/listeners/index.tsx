import { PresenceListener } from '@/components/room/listeners/PresenceListener';
import { ReceiveSettingsListener } from '@/components/room/listeners/ReceiveSettingsListener';
import { SubscriptionsListener } from '@/components/room/listeners/SubscriptionsListener';

export function Listeners() {
  return (
    <>
      <SubscriptionsListener />
      <PresenceListener />
      <ReceiveSettingsListener />
    </>
  );
}
