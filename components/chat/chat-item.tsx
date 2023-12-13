"use client";
import { Member, MemberRole, Profile } from "@prisma/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserAvatar from "../user-avatar";
import ActionToolTip from "../action-tooltip";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl?: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}
const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem: React.FC<ChatItemProps> = ({
  content,
  currentMember,
  deleted,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
  fileUrl,
}) => {
  const fileType = fileUrl?.split(".").pop();
  const isAdmin = useMemo(() => {
    return currentMember.role === MemberRole.ADMIN;
  }, [currentMember.role]);
  const isModerator = useMemo(() => {
    return currentMember.role === MemberRole.MODERATOR;
  }, [currentMember.role]);

  const isOwner = useMemo(() => {
    return currentMember.id === member.id;
  }, [currentMember.id, member.id]);

  const canDeleteMessage = useMemo(() => {
    return !deleted && (isAdmin || isModerator || isOwner);
  }, [deleted, isAdmin, isModerator, isOwner]);

  const canEditMessage = useMemo(() => {
    return !deleted && isOwner && !fileUrl;
  }, [deleted, fileUrl, isOwner]);
  const isPdf = useMemo(() => {
    return fileType === "pdf" && fileUrl;
  }, [fileType, fileUrl]);

  const isImage = useMemo(() => {
    return !isPdf && fileUrl;
  }, [fileUrl, isPdf]);

  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  const isLoading = useMemo(() => {
    return form.formState.isSubmitting;
  }, [form.formState.isSubmitting]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const url = qs.stringifyUrl({
          url: `${socketUrl}/${id}`,
          query: socketQuery,
        });
        await axios.patch(url, values);
        form.reset();
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        console.log(error);
      }
    },
    [form, id, router, socketQuery, socketUrl]
  );

  const memberClick = useCallback(() => {
    if (member.id === currentMember.id) {
      return;
    }
    if (params) {
      router.push(`/servers/${params.serverId}/conversations/${member?.id}`);
    }
  }, [currentMember.id, member.id, params, router]);

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={memberClick}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={memberClick}
              >
                {member.profile.name}
              </p>
              <ActionToolTip label={member.role}>
                {roleIconMap[member.role]}
              </ActionToolTip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && fileUrl && (
            <a
              title="Image"
              href={fileUrl}
              target="__blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && fileUrl && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="__blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                Pdf File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            placeholder="Edited Message"
                            {...field}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size={"sm"} disabled={isLoading} variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                press escape to cancel,enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800
        border rounded-sm"
        >
          {canEditMessage && (
            <ActionToolTip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-600 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionToolTip>
          )}{" "}
          <ActionToolTip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-600 transition"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionToolTip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
