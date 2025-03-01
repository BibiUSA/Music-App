import "./Chat.css";
import ConvoMessage from "./ConvoMessage";
//shows all the interaction between user and a friend
import SendMessage from "./SendMessage";

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

  return (
    <div className="chat">
      <div className="messagePartner">{`To: ${
        props.partner[1] ? props.partner[1]["userinfo"]["displayName"] : "none"
      }`}</div>
      <ConvoMessage partner={nextProp} />
      <SendMessage partner={nextProp} />
    </div>
  );
}
