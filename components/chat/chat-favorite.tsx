import { Star } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useEffect, useState } from "react";

interface ChatFavoriteProps {
  messageId: string;
  content?: string;
  member?: any;
  profileId?: string;
  timestamp?: string;
}

export const toggleFavorite = async ({
  messageId,
  content,
  member,
  profileId,
  timestamp,
}: ChatFavoriteProps) => {
  const storedValue = localStorage.getItem("disFav");
  const isFav = storedValue ? JSON.parse(storedValue) : [];

  const checkFav = isFav.find((oneMess: any) => oneMess.IdMessage == messageId);

  if (!checkFav) {
    const favMessage = {
      IdMessage: messageId,
      content: content,
      member: member,
      profileId: profileId,
      timestamp: timestamp,
    };
    isFav.push(favMessage);
    localStorage.setItem("disFav", JSON.stringify(isFav));
  } else {
    const newFavArr = isFav.filter(
      (oneMess: any) => oneMess.IdMessage != messageId
    );

    localStorage.setItem("disFav", JSON.stringify(newFavArr));
  }
};

const checkFavorite = ({ messageId }: ChatFavoriteProps) => {
  const storedValue = localStorage.getItem("disFav");
  const isFav = storedValue ? JSON.parse(storedValue) : [];
  const checkFav = isFav.find((oneMess: any) => oneMess.IdMessage == messageId);

  if (checkFav) return true;
  return false;
};

const ChatFavorite = ({
  messageId,
  content,
  member,
  profileId,
  timestamp,
}: ChatFavoriteProps) => {
  const [prikol, setPrikol] = useState(false);
  const [isFavMess, setIsFavMess] = useState(false);

  useEffect(() => {
    setIsFavMess(checkFavorite({ messageId }));
  }, [prikol]);

  return (
    <div>
      <ActionTooltip
        label={isFavMess ? "Remove from Favorites" : "Add to Favorites"}
      >
        <Star
          onClick={() => {
            toggleFavorite({
              messageId,
              content,
              member,
              profileId,
              timestamp,
            });
            setPrikol(!prikol);
          }}
          className={`cursor-pointer ml-auto w-4 h-4 ${
            isFavMess
              ? "text-yellow-500 dark:hover:text-yellow-700"
              : "text-zinc-500 dark:hover:text-zinc-300"
          } transition`}
        />
      </ActionTooltip>
    </div>
  );
};

export default ChatFavorite;
