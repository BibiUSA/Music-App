import "./Chat.css";
//shows all the interaction between user and a friend
import Messages from "./Messages";
import SendMessage from "./SendMessage";

export default function Chat() {
  return (
    <div className="chat">
      <div className="messagePartner">To: Messager124</div>
      <Messages />
      <SendMessage />
    </div>
  );
}
