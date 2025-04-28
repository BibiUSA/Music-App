//Allows user to message friends
import "./Messages.css";
import axios from "../../config/axios";
import { useContext, useEffect, useState } from "react";
import context from "../../contexts/auth/context";
import Conversation from "../../components/Conversation";
import Chat from "../../components/Chat";
import Side from "../../components/Side";
import { isMobile } from "../../utils/IsMobile";

export default function Message() {
  const { user } = useContext(context);
  const [convoPartner, setConvoPartner] = useState([]);

  console.log("Mobile", isMobile());

  console.log("CONVO PARTNER", convoPartner);

  //collected from grandchildren to see who the person the chat on the right side will open up for
  const getConvoPartner = (data) => {
    console.log("ConvoPartner granparent", data);
    setConvoPartner(data);
  };

  const showSide = () => {
    console.log("SHOWSIDE");
    if (!isMobile()) {
      return <Side getPartner={getConvoPartner} />;
    } else if (isMobile() && convoPartner.length == 0) {
      return <Side getPartner={getConvoPartner} />;
    }
  };

  const showChat = () => {
    if (!isMobile()) {
      return <Chat partner={convoPartner} />;
    } else if (isMobile() && convoPartner.length > 0) {
      return <Chat partner={convoPartner} getPartner={getConvoPartner} />;
    }
  };

  return (
    <div className="messagePage">
      <div className="box">
        {/* {isMobile() && convoPartner.length == 0 && (
          <Side getPartner={getConvoPartner} />
        )} */}
        {showSide()}
        {showChat()}
        {/* <Chat partner={convoPartner} /> */}
      </div>
    </div>
  );
}
