import { useStateProvider } from "@/context/StateContext";
import React from "react";

function index() {
  const [{ userInfo, newUser }] = useStateProvider();
  console.log("userInfo", userInfo);
  console.log("newUser", newUser);

  return <div>index</div>;
}

export default index;
