import dynamic from 'next/dynamic';
import { useBroadcast } from '@/states/broadcastState';
import { useCreateRTMP } from '@/states/createRTMPState';
import { useJoinStage } from '@/states/joinStageState';
import { useMobileSidebar } from '@/states/mobileSidebarState';

const BroadcastModal = dynamic(() =>
  import('@/components/Room/Modals/Broadcast').then(
    (mod) => mod.BroadcastModal,
  ),
);
const JoinStageModal = dynamic(() =>
  import('@/components/Room/Modals/JoinStage').then(
    (mod) => mod.JoinStageModal,
  ),
);
const MobileSidebar = dynamic(() =>
  import('@/components/Room/Modals/MobileSidebar').then(
    (mod) => mod.MobileSidebar,
  ),
);
const RTMPModal = dynamic(() =>
  import('@/components/Room/Modals/Rtmp').then((mod) => mod.RTMPModal),
);

export function Modals() {
  const [broadcast] = useBroadcast();
  const [joinStage] = useJoinStage();
  const [mobileSidebar] = useMobileSidebar();
  const [rtmp] = useCreateRTMP();

  return (
    <>
      {broadcast && <BroadcastModal />}
      {joinStage && <JoinStageModal />}
      {mobileSidebar && <MobileSidebar />}
      {rtmp && <RTMPModal />}
    </>
  );
}
