import { Hash } from "lucide-react";
import React from "react";
import MobileToggle from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  serverId,
  type,
  imageUrl,
}) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400 ml-2" />
      )}
      {type === "conversation" && imageUrl && (
        <div className="mx-2 ">
          <UserAvatar src={imageUrl} />
        </div>
      )}
      <p className="text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
