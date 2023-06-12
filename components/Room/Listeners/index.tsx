import { AppMessageListener } from '@/components/Room/Listeners/AppMessageListener';
import { PresenceListener } from '@/components/Room/Listeners/PresenceListener';
import { ReceiveSettingsListener } from '@/components/Room/Listeners/ReceiveSettingsListener';
import { SendSettingsListener } from '@/components/Room/Listeners/SendSettingsListener';
import { SubscriptionsListener } from '@/components/Room/Listeners/SubscriptionsListener';

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
