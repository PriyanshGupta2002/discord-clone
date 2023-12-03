import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import { Button } from "./ui/button";
import ServerSidebar from "./server/server-sidebar";

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size="icon" className="md:hidden">
            {" "}
            <Menu className="md:hidden w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>

          <ServerSidebar serverId={serverId} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileToggle;
