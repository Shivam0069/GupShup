import { SocketCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
const Container = dynamic(() => import("./Container"), { ssr: false });
function VideoCall() {
  const [{ videoCall, socket, userInfo }, dispatch] = useStateProvider();
  useEffect(() => {
    if (videoCall.type === "out-going") {
      socket.current.emit(SocketCases.OUTGOING_VIDEO_CALL, {
        to: videoCall.id,
        from: {
          name: userInfo.name,
          id: userInfo.id,
          profilePicture: userInfo.profileImage,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall]);
  return <Container data={videoCall} />;
}

export default VideoCall;
