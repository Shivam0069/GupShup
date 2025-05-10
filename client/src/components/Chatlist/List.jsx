import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import { reducerCases } from "@/context/constants";

function List() {
  const [
    { userInfo, userContacts, filteredContacts, contactSearch },
    dispatch,
  ] = useStateProvider();

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
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))
        : userContacts?.length > 0 && contactSearch.length === 0
        ? userContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))
        : null}
    </div>
  );
}

export default List;
