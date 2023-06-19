import { BroadcastModal } from '@/components/Room/Modals/Broadcast';
import { JoinStageModal } from '@/components/Room/Modals/JoinStage';
import { MobileSidebar } from '@/components/Room/Modals/MobileSidebar';
import { RTMPModal } from '@/components/Room/Modals/Rtmp';

export function Modals() {
  return (
    <>
      <BroadcastModal />
      <JoinStageModal />
      <MobileSidebar />
      <RTMPModal />
    </>
  );
}
