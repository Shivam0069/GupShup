import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatLIstItem({ data, isContactPage = false }) {
  const [{ currentChatUser, userInfo }, dispatch] = useStateProvider();
  const handleContactClick = () => {
    dispatch({
      type: reducerCases.CHANGE_CURRENT_CHAT_USER,
      user: { ...data },
    });
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };
  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data?.profilePicture} />
      </div>
      <div
        className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full
       "
      >
        <div className="flex justify-between">
          <div>
            <span className="text-white text-base">{data?.name}</span>
          </div>
        </div>
        <div
          className="flex border-b border-conversation-border pb-2 pt-1 pr-2
         "
        >
          <div className="flex justify-between w-full">
            <span className="text-sm line-clamp-1 text-secondary">
              {data?.about || "\u00A0"}
            </span>
          </div>
        </div>
        <div
          className="flex  pb-2 pt-1 pr-2
         "
        >
          <div className="flex justify-between w-full">
            <span className="text-xs text-secondary">{data?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
