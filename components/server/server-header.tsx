"use client";
import React, { useMemo } from "react";

import { Channel, Member, MemberRole, Server } from "@prisma/client";
import { ServerWithMembersWithProfile } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  TrashIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfile;
  role?: MemberRole;
}

const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  const isAdmin = useMemo(() => {
    return role === MemberRole.ADMIN;
  }, [role]);
  const isModerator = useMemo(() => {
    return isAdmin || role === MemberRole.MODERATOR;
  }, [isAdmin, role]);

  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-2 md:ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] "
      >
        {isModerator && (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("invite", { server })}
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("editServer", { server })}
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("members", { server })}
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("createChannel", { server })}
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-rose-500 text-sm cursor-pointer"
            onClick={() => onOpen("deleteServer", { server })}
          >
            Delete Server
            <TrashIcon className="h-4 w-4 ml-auto " />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer text-rose-500"
            onClick={() => onOpen("leaveServer", { server })}
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
