import { AppMessageListener } from '@/components/room/listeners/AppMessageListener';
import { PresenceListener } from '@/components/room/listeners/PresenceListener';
import { ReceiveSettingsListener } from '@/components/room/listeners/ReceiveSettingsListener';
import { SendSettingsListener } from '@/components/room/listeners/SendSettingsListener';
import { SubscriptionsListener } from '@/components/room/listeners/SubscriptionsListener';

export function Listeners() {
  return (
    <>
      <AppMessageListener />
      <SubscriptionsListener />
      <PresenceListener />
      <ReceiveSettingsListener />
      <SendSettingsListener />
    </>
  );
}
