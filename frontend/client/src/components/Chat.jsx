import "./Chat.css";
import ConvoMessage from "./ConvoMessage";
//shows all the interaction between user and a friend
import SendMessage from "./SendMessage";
import { isMobile } from "../utils/isMobile";
import { IconChevronLeft } from "@tabler/icons-react";

export default function Chat(props) {
  console.log("Conversation ready with", props.partner);
  let nextProp = {};
  if (props.partner[1]) {
    nextProp = {
      combinedId: props.partner[0],
      displayName: props.partner[1]["userinfo"]["displayName"],
      img_url: props.partner[1]["userinfo"]["photoUrl"],
      uid: props.partner[1]["userinfo"]["uid"],
    };
  }

  const setPartnerNone = () => {
    props.getPartner([]);
  };

  return (
    <div className={isMobile() ? "chat-mobile chat" : "chat"}>
      <div className="messagePartner">
        {isMobile() && (
          <div className="back" onClick={() => setPartnerNone()}>
            <IconChevronLeft stroke={2} />
          </div>
        )}
        <h4 className="person-title">{`To: ${
          props.partner[1]
            ? props.partner[1]["userinfo"]["displayName"]
            : "none"
        }`}</h4>
      </div>
      <ConvoMessage partner={nextProp} />
      <SendMessage partner={nextProp} />
    </div>
  );
}
