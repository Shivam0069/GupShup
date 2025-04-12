import { reducerCases, SocketCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    const messageData = {
      from: userInfo?.id,
      to: currentChatUser?.id,
      message: message,
    };
    try {
      if (message.trim() === "") return;
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, messageData);

      socket.current.emit(SocketCases.SEND_MESSAGE, {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: data.message,
      });

      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: { ...data.message },
        fromSelf: true,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-xl cursor-pointer text-panel-header-icon"
            title="Emoji"
          />
          <ImAttachment
            className="text-xl cursor-pointer text-panel-header-icon"
            title="Attach File"
          />
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className="flex items-center justify-center w-10 ">
          <MdSend
            className="text-xl cursor-pointer text-panel-header-icon"
            title="send message"
            onClick={sendMessage}
          />
          {/* <FaMicrophone
            className="text-xl cursor-pointer text-panel-header-icon"
            title="Record "
          /> */}
        </div>
      </>
    </div>
  );
}

export default MessageBar;
