import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
const Container = dynamic(() => import("./Container"), { ssr: false });
function VideoCall() {
  const [{ videoCall, socket, userInfo }, dispatch] = useStateProvider();
  useEffect(() => {}, [videoCall]);
  return <Container data={videoCall} />;
}

export default VideoCall;
