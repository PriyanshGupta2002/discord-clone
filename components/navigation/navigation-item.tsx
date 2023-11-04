"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import React from "react";
import ActionToolTip from "../action-tooltip";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
const NavigationItem: React.FC<NavigationItemProps> = ({
  id,
  imageUrl,
  name,
}) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <ActionToolTip label={name} side="right" align="center">
      <button onClick={onClick} className="relative group flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full  transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex h-[48px] mx-3 w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionToolTip>
  );
};

export default NavigationItem;
