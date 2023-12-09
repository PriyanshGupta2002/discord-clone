"use client";
import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";

interface ChatMessagesProps {
  name: string;
  member: Member;
  paramValue: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  type: "channel" | "conversation";
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  apiUrl,
  paramValue,
  member,
  name,
  paramKey,
  socketQuery,
  socketUrl,
  type,
}) => {
  const queryKey = `chat:${paramValue}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
    </div>
  );
};

export default ChatMessages;
