import { reducerCases, SocketCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE, GET_MESSAGES, HOST } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import Chat from "./Chat/Chat";
import SearchMessages from "./Chat/SearchMessages";
import ChatList from "./Chatlist/ChatList";
import IncomingCall from "./common/IncomingCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import Empty from "./Empty";

function Main() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const router = useRouter();
  const [
    {
      userInfo,
      currentChatUser,
      messagesSearch,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateProvider();
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
      socket.current.emit(SocketCases.ADD_USER, userInfo.id);
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
    if (socket.current) {
      socket.current.on(SocketCases.ONLINE_USERS, (data) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers: data.onlineUsers,
        });
      });

      socket.current.on(
        SocketCases.INCOMING_VOICE_CALL,
        ({ from, roomId, callType }) => {
          dispatch({
            type: reducerCases.SET_INCOMING_VOICE_CALL,
            incomingVoiceCall: {
              ...from,
              roomId,
              callType,
            },
          });
        }
      );
      socket.current.on(
        SocketCases.INCOMING_VIDEO_CALL,
        ({ from, roomId, callType }) => {
          dispatch({
            type: reducerCases.SET_INCOMING_VIDEO_CALL,
            incomingVideoCall: {
              ...from,
              roomId,
              callType,
            },
          });
        }
      );
      socket.current.on(SocketCases.CALL_REJECTED, () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });
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
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}

      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div
              className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
