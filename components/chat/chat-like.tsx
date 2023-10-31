import { Heart } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";

const ChatLike = () => {
  return (
    <>
      <ActionTooltip label="1">
        <Heart className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </ActionTooltip>
    </>
  );
};

export default ChatLike;
