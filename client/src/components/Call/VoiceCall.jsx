import { SocketCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
const Container = dynamic(() => import("./Container"), { ssr: false });
function VoiceCall() {
  const [{ voiceCall, socket, userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    if (voiceCall.type === "out-going") {
      socket.current.emit(SocketCases.OUTGOING_VOICE_CALL, {
        to: voiceCall.id,
        from: {
          name: userInfo.name,
          id: userInfo.id,
          profilePicture: userInfo.profilePicture,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);

  return <Container data={voiceCall} />;
}

export default VoiceCall;
