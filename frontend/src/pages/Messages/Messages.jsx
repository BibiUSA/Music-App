//Allows user to message friends
import "./Messages.css";
import axios from "../../config/axios";
import { useContext, useEffect, useState } from "react";
import context from "../../contexts/auth/context";
import Conversation from "../../components/Conversation";
import Chat from "../../components/Chat";
import Side from "../../components/Side";

export default function Message() {
  const { user } = useContext(context);
  //   const [conversations, setConversations] = useState([]);

  //   const getMessages = async () => {
  //     try {
  //       const response = await axios.get("/message/get", {
  //         params: { user: user.displayName },
  //       });
  //       setConversations(response.data.rows);
  //       console.log(response.data.rows);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     getMessages();
  //   }, []);

  //   const spreadConvo = conversations.map((convo) => {
  //     return <Conversation key={convo.message_id} message={convo} />;
  //   });

  return (
    <div className="messagePage">
      <div className="box">
        <Side />
        <Chat />
        {/* <h3>Messages</h3>
      
      <div className="conversations">{spreadConvo}</div> */}
      </div>
    </div>
  );
}
