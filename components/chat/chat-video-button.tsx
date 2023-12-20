"use client";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ActionToolTip from "../action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { useCallback } from "react";
export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? "End Video Call" : "Start Video";
  const onClick = useCallback(() => {
    const url = qs.stringifyUrl(
      {
        url: pathName || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  }, [isVideo, pathName, router]);
  return (
    <ActionToolTip side="bottom" label={toolTipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionToolTip>
  );
};
