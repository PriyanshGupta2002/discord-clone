"use client";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, className }) => {
  return (
    <Avatar>
      <AvatarImage src={src} className={cn("h-10 w-10 ", className)} />
    </Avatar>
  );
};

export default UserAvatar;
