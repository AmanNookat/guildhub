"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { useEffect, useState } from "react";
import { toggleFavorite } from "../chat/chat-favorite";

export const FavoritesModal = () => {
  const [favoritesArr, setFavoritesArr] = useState([]);
  const { isOpen, onClose, type } = useModal();
  const [prikol, setPrikol] = useState(false);

  const isModalOpen = isOpen && type === "favoritesMessages";

  useEffect(() => {
    const storedValue = localStorage.getItem("disFav");
    const isFav = storedValue ? JSON.parse(storedValue) : [];

    setFavoritesArr(isFav);
  }, [isOpen, prikol]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Favorites Messages
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {favoritesArr.length ? (
            favoritesArr.map((message: any) => (
              <div
                key={message.IdMessage}
                className="flex items-center gap-x-2 mb-6 "
              >
                <UserAvatar src={message.member.profile.imageUrl} />
                <div>
                  <div className="flex flex-col">
                    <div className="flex gap-x-3 items-center">
                      <p>{message.member.profile.name}</p>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
                {/* <button
                  onClick={() => {
                    toggleFavorite({ messageId: message.IdMessage });
                    setPrikol(!prikol);
                  }}
                >
                  remove
                </button> */}
              </div>
            ))
          ) : (
            <DialogTitle className="flex justify-center">
              No favorites
            </DialogTitle>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
