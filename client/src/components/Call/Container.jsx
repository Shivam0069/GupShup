import { reducerCases, SocketCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publicStream, setPublicStream] = useState(undefined);

  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on(SocketCases.CALL_ACCEPTED, () => {
        setCallAccepted(true);
      });
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get(`${GET_CALL_TOKEN_ROUTE}/${userInfo.id}`);
        setToken(res.data.token);
      } catch (error) {
        console.log("Token fetch failed:", error);
      }
    };
    if (callAccepted) getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
      const zg = new ZegoExpressEngine(
        process.env.NEXT_PUBLIC_ZEGO_APP_ID,
        process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
      );
      setZgVar(zg);

      zg.on(
        "roomStreamUpdate",
        async (roomID, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
            const remoteContainer = document.getElementById("remote-video");
            const remoteElement = document.createElement(
              data.callType === "video" ? "video" : "audio"
            );
            remoteElement.id = streamList[0].streamID;
            remoteElement.autoplay = true;
            remoteElement.playsInline = true;
            remoteElement.muted = false;

            if (remoteContainer) {
              remoteContainer.appendChild(remoteElement);
            }

            const remoteStream = await zg.startPlayingStream(
              streamList[0].streamID,
              {
                audio: true,
                video: true,
              }
            );
            remoteElement.srcObject = remoteStream;
          } else if (
            updateType === "DELETE" &&
            zg &&
            localStream &&
            streamList[0].streamID
          ) {
            try {
              zg.destroyStream(localStream);
              zg.stopPublishingStream(streamList[0].streamID);
              zg.logoutRoom(data.roomId.toString());
            } catch (error) {
              console.warn("Cleanup error:", error);
            }

            dispatch({
              type: reducerCases.END_CALL,
            });
          }
        }
      );

      try {
        await zg.loginRoom(
          data.roomId.toString(),
          token,
          {
            userID: userInfo.id.toString(),
            username: userInfo.name,
          },
          {
            userUpdate: true,
          }
        );

        const localStreamCreated = await zg.createStream({
          camera: {
            video: data.callType === "video",
            audio: true,
          },
        });

        const localContainer = document.getElementById("local-audio");
        const localElement = document.createElement(
          data.callType === "video" ? "video" : "audio"
        );
        localElement.id = "video-local-zego";
        localElement.className = "h-28 w-32";
        localElement.autoplay = true;
        localElement.muted = true; // Prevent echo
        localElement.playsInline = true;

        localContainer.appendChild(localElement);
        localElement.srcObject = localStreamCreated;

        const streamID = "123" + Date.now();
        setPublicStream(streamID);
        setLocalStream(localStreamCreated);

        if (
          !localStreamCreated ||
          !(localStreamCreated instanceof MediaStream)
        ) {
          alert("Invalid localStream: Not a MediaStream");
          return;
        }

        zg.startPublishingStream(streamID, localStreamCreated);
      } catch (err) {
        console.error("Start call error:", err);
      }
    };

    if (token) {
      startCall();
    }
  }, [token]);

  const endCall = () => {
    try {
      if (zgVar && localStream && publicStream) {
        zgVar.destroyStream(localStream);
        zgVar.stopPublishingStream(publicStream);
        zgVar.logoutRoom(data.roomId.toString());
      }
    } catch (err) {
      console.warn("Error ending call:", err);
    }

    socket.current.emit(SocketCases.REJECT_CALL, {
      from: data.id,
    });

    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>

      {(!callAccepted || data.callType === "voice") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="Avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}

      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>

      <div
        onClick={endCall}
        className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full cursor-pointer"
      >
        <MdOutlineCallEnd className="text-3xl" />
      </div>
    </div>
  );
}

export default Container;
