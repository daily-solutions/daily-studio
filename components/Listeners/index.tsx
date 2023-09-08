import { AppMessageListener } from '@/components/Listeners/AppMessageListener';
import { ParamsListener } from '@/components/Listeners/ParamsListener';
import { PresenceListener } from '@/components/Listeners/PresenceListener';
import { ReceiveSettingsListener } from '@/components/Listeners/ReceiveSettings';
import { SendSettingsListener } from '@/components/Listeners/SendSettings';
import { StageAppMessageListener } from '@/components/Listeners/StageAppMessageListener';
import { SubscriptionsListener } from '@/components/Listeners/SubscriptionsListener';

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
