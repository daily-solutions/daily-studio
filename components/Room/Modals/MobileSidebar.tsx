import { useMobileSidebar } from '@/states/mobileSidebarState';
import { Sheet, SheetContent } from '@/ui/Sheet';

import { Sidebar } from '@/components/Room/Sidebar';

export default function MobileSidebar() {
  const [open, setOpen] = useMobileSidebar();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full p-0">
        <Sidebar visibleInMobile />
      </SheetContent>
    </Sheet>
  );
}
