"use client";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { Button } from "../ui/button";
import qs from "query-string";

export const DeleteChannelModal = () => {
  const router = useRouter();

  const {
    isOpen,
    onClose,
    type,
    data: { channel, server },
    onOpen,
  } = useModal();

  const isModalOpen = isOpen && type === "deletChannel";
  const [isLoading, setIsLoading] = useState(false);

  const handleLeaveServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}/delete`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  }, [channel?.id, server?.id, onClose, router]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500 underline">
              #{channel?.name}
            </span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={() => onClose()}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"primary"}
              onClick={handleLeaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
