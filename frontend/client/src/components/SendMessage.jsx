//used to type and send the message while chatting
import "./SendMessage.css";
import {
  updateDoc,
  getDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  increment,
  setDoc,
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import context from "../contexts/auth/context";
import { isMobile } from "../utils/IsMobile";
import {
  sendAMessage,
  doesDocumentExist,
  setSeenLastMssgTime,
} from "../Services/firebaseCalls";

export default function SendMessage(props) {
  const [message, setMessage] = useState("");
  console.log(props);
  const { user } = useContext(context);
  console.log(user);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && message.length > 0) {
      console.log("Entered");
      try {
        sendAMessage(props.partner["combinedId"], message, user.uid);
        setSeenLastMssgTime(
          "userChats",
          props.partner["uid"],
          true,
          props.partner["combinedId"],
          props.partner["uid"],
          props.partner["displayName"],
          props.partner["img_url"],
          user.uid,
          user.displayName,
          user.photoURL,
          message,
          true
        );
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log("wow");

  return (
    <div
      className={isMobile() ? "sendMessage-mobile sendMessage" : "sendMessage"}
    >
      <input
        className="sendmessageinput"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => sendMessage(e)}
        type="textarea"
        placeholder="Send Message Here"
        value={message}
      />
    </div>
  );
}
