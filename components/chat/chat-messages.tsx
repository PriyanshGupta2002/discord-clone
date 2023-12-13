"use client";
import { Member } from "@prisma/client";
import React, { Fragment, useRef, ElementRef } from "react";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash, ShieldAlert, ShieldCheck } from "lucide-react";
import { MessageWithMemberWithProfile } from "@/types";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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
  const addKey = `chat:${paramValue}:messages`;
  const updateKey = `chat:${paramValue}:messages:update`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const dateFormat = "d MMM yyyy,HH:mm";
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="animate-spin my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading Messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className=" my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something Went Wrong...
        </p>
      </div>
    );
  }
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto ">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                id={message.id}
                content={message.content}
                fileUrl={message?.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), dateFormat)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                member={message.member}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
