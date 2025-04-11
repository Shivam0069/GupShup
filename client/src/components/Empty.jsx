import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-conversation-border border-1 w-full flex flex-col bg-panel-header-background h-[100vh] border-b-4 border-b-icon-green items-center justify-center ">
      <Image src="/whatsapp.gif" alt="GupShup" height={300} width={300} />
    </div>
  );
}

export default Empty;
