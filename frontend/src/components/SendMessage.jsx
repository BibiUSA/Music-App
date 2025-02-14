//used to type and send the message while chatting
import "./SendMessage.css";

export default function SendMessage() {
  return (
    <div className="sendMessage">
      <input
        className="sendmessageinput"
        type="textarea"
        placeholder="Send Message Here"
      />
    </div>
  );
}
