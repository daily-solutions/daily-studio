import React, { useCallback } from 'react';
import { config } from '@/config';
import { Button } from '@/ui/Button';

import { useStage } from '@/hooks/useStage';

export function RequestToJoin() {
  const { isRequesting, requestToJoin, cancelRequestToJoin } = useStage();

  const handleRequestToJoin = useCallback(
    () => (isRequesting ? cancelRequestToJoin() : requestToJoin()),
    [isRequesting, cancelRequestToJoin, requestToJoin]
  );

  if (!config?.options?.enable_viewers_request_to_join) return null;

  return (
    <Button
      variant={isRequesting ? 'destructive' : 'default'}
      onClick={handleRequestToJoin}
    >
      {isRequesting ? 'Cancel request' : 'Request to join stage'}
    </Button>
  );
}
