import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { reducerCases, SocketCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";

function Main() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const router = useRouter();
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) setRedirectLogin(true);
    if (!userInfo && user?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: user.email,
      });

      if (!data?.success) {
        router.push("/login");
      }
      if (data?.data) {
        const { id, name, email, profilePicture: profileImage } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status: data?.success,
          },
        });
      }
    }
  });

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on(SocketCases.MSG_RECEIVE, (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...data.message },
        });
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.post(
          `${GET_MESSAGES}/${userInfo?.id}/${currentChatUser?.id}`
        );

        if (response.status === 200) {
          dispatch({
            type: reducerCases.SET_MESSAGES,
            messages: response.data.messages,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);
  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {currentChatUser ? <Chat /> : <Empty />}
      </div>
    </>
  );
}

export default Main;
