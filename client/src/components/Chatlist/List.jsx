import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import { reducerCases } from "@/context/constants";

function List() {
  const [{ userInfo, userContacts }, dispatch] = useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: users,
        });
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers: onlineUsers,
        });
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    if (userInfo?.id) {
      getContacts();
    }
  }, [userInfo]);
  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {userContacts.map((contact) => (
        <ChatLIstItem data={contact} key={contact.id} />
      ))}
    </div>
  );
}

export default List;
