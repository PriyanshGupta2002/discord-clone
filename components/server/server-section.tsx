"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionToolTip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfile;
}

const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  sectionType,
  channelType,
  role,
  server,
}) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "GUEST" && sectionType === "channels" && (
        <ActionToolTip label="Create Channel" side="top">
          <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Plus
              className="h-4 w-4"
              onClick={() => onOpen("createChannel", { server, channelType })}
            />
          </button>
        </ActionToolTip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionToolTip label="Manage Members" side="top">
          <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Settings
              className="h-4 w-4"
              onClick={() => onOpen("members", { server })}
            />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
};

export default ServerSection;
