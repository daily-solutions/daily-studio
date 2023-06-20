import { useCallback } from 'react';
import { useJoinStage } from '@/states/joinStageState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/Dialog';

import { Setup } from '@/components/Room/Haircheck/Setup';

export function JoinStageModal() {
  const [show, setShow] = useJoinStage();

  const onJoin = useCallback(() => setShow(false), [setShow]);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>You are invited to join the stage</DialogTitle>
          <DialogDescription>
            Please turn on your camera and microphone and wait for the host to
            let you in.
          </DialogDescription>
        </DialogHeader>
        <Setup onJoin={onJoin} />
      </DialogContent>
    </Dialog>
  );
}
