import { AppMessageListener } from '@/components/Room/Listeners/AppMessageListener';
import { ParamsListener } from '@/components/Room/Listeners/ParamsListener';
import { PresenceListener } from '@/components/Room/Listeners/PresenceListener';
import { ReceiveSettingsListener } from '@/components/Room/Listeners/ReceiveSettingsListener';
import { SendSettingsListener } from '@/components/Room/Listeners/SendSettingsListener';
import { StageAppMessageListener } from '@/components/Room/Listeners/StageAppMessageListener';
import { SubscriptionsListener } from '@/components/Room/Listeners/SubscriptionsListener';

export function Listeners() {
  return (
    <>
      <StageAppMessageListener />
      <ParamsListener />
      <AppMessageListener />
      <SubscriptionsListener />
      <PresenceListener />
      <ReceiveSettingsListener />
      <SendSettingsListener />
    </>
  );
}
