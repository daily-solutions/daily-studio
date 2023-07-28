import { Configurations } from '@/components/Room/Sidebar/VCS/Configurations';
import { VCSConfig } from '@/components/Room/Sidebar/VCS/VCSConfig';

export function VCS() {
  return (
    <div className="p-4">
      <VCSConfig />
      <Configurations />
    </div>
  );
}
