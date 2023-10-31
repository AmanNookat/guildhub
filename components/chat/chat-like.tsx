import { Heart, HeartCrack, HeartIcon, HeartOff } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ChatLikeProps {
  profileId: string;
  messageId: string;
}

const likeAPI = "http://localhost:8000/likes";

const toggleLike = async (IdProfile: string, IdMessage: string) => {
  const { data } = await axios.get(likeAPI);

  const checkLike = data.find((oneLike: any) => {
    return IdMessage == oneLike.messageId;
  });

  if (!checkLike) {
    const likeData: any = {
      messageId: IdMessage,
      likes: [],
    };
    likeData.likes.push(IdProfile);

    await axios.post(likeAPI, likeData);
  } else {
    const isLiked = checkLike.likes.includes(IdProfile);

    if (isLiked) {
      checkLike.likes = checkLike.likes.filter(
        (profile: string) => profile != IdProfile
      );
    } else {
      checkLike.likes.push(IdProfile);
    }
    await axios.patch(`${likeAPI}/${checkLike.id}`, checkLike);
  }
};

const ChatLike = ({ profileId, messageId }: ChatLikeProps) => {
  const [liked, setLiked] = useState(false);
  const [changeClick, setChangeClick] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  const handleLikeClick = async () => {
    setLiked(!liked);

    try {
      await toggleLike(profileId, messageId);

      const { data } = await axios.get(likeAPI);
      const checkLike = data.find(
        (oneLike: any) => messageId == oneLike.messageId
      );

      if (checkLike) {
        setLikeCount(checkLike.likes.length);
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса: ", error);
      setLiked(!liked);
    }
  };

  useEffect(() => {
    const checkLikeState = async () => {
      try {
        const { data } = await axios.get(likeAPI);

        const checkLike = data.find(
          (oneLike: any) => messageId == oneLike.messageId
        );

        if (checkLike) {
          setLikeCount(checkLike.likes.length);

          if (checkLike.likes.includes(profileId)) {
            setLiked(true);
            setChangeClick(1);
          }
        } else {
          setLiked(false);
          setChangeClick(2);
        }
      } catch (error) {
        console.error("Ошибка при загрузке начального состояния: ", error);
      }
    };
    checkLikeState();
  }, [changeClick]);

  return (
    <div className="flex items-center">
      <div>
        <ActionTooltip label={`${likeCount}`}>
          {!liked ? (
            <>
              <Heart
                onClick={handleLikeClick}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500  dark:hover:text-zinc-300 transition"
              />
            </>
          ) : (
            <>
              <Heart
                onClick={handleLikeClick}
                className="cursor-pointer ml-auto w-4 h-4 text-rose-500  dark:hover:text-rose-700 transition"
              />
            </>
          )}
        </ActionTooltip>
      </div>
      <div>{likeCount}</div>
    </div>
  );
};

export default ChatLike;
