"use client";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useMemo, useState } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
import { cn } from "@/lib/utils";

export const InviteModal = () => {
  const router = useRouter();

  const {
    isOpen,
    onClose,
    type,
    data: { server },
    onOpen,
  } = useModal();

  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin();

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(inviteUrl);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [inviteUrl]);

  const onNew = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  }, [onOpen, server?.id]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl">Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button disabled={isLoading} size="icon" onClick={onCopy}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={onNew}
          >
            {isLoading ? "Generating..." : "Generate a new link"}
            <RefreshCw
              className={cn(isLoading && "animate-spin", "w-4 h-4 ml-2")}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
