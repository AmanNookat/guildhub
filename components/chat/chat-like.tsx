import { Heart } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import axios from "axios";

interface ChatLikeProps {
  profileId: string;
  messageId: string;
}

const likeAPI = "http://localhost:8000/likes";

const toggleLike = async (IdProfile: string, IdMessage: string) => {
  const { data } = await axios.get(likeAPI);

  console.log(data);

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
    console.log(isLiked);

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
  return (
    <ActionTooltip label="1">
      <Heart
        onClick={() => {
          toggleLike(profileId, messageId);
        }}
        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
      />
    </ActionTooltip>
  );
};

export default ChatLike;
