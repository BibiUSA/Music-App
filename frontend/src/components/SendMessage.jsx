//used to type and send the message while chatting
import "./SendMessage.css";
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import context from "../contexts/auth/context";

export default function SendMessage(props) {
  const [say, setSay] = useState("");
  console.log(props.partner);
  const { user } = useContext(context);
  console.log(user);

  const sendSay = async (e) => {
    if (e.key === "Enter" && say.length > 0) {
      console.log("Entered");
      try {
        await updateDoc(doc(firebaseDb, "chats", props.partner["combinedId"]), {
          messages: arrayUnion({
            id: uuidv4(),
            text: say,
            senderId: user.uid,
            date: Timestamp.now(),
          }),
        });

        setSay("");

        await updateDoc(doc(firebaseDb, "userChats", user.uid), {
          [props.partner["combinedId"]]: {
            userinfo: {
              uid: props.partner["uid"],
              displayName: props.partner["displayName"],
              photoUrl: props.partner["img_url"],
            },
            lastMessage: {
              say,
            },
            date: serverTimestamp(),
          },
        });

        await updateDoc(doc(firebaseDb, "userChats", props.partner["uid"]), {
          [props.partner["combinedId"]]: {
            userinfo: {
              uid: user.uid,
              displayName: user.displayName,
              photoUrl: user.photoURL,
            },
            lastMessage: {
              say,
            },
            date: serverTimestamp(),
          },
        });

        console.log("done");
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log("wow");

  return (
    <div className="sendMessage">
      <input
        className="sendmessageinput"
        onChange={(e) => {
          setSay(e.target.value);
        }}
        onKeyDown={(e) => sendSay(e)}
        type="textarea"
        placeholder="Send Message Here"
        value={say}
      />
    </div>
  );
}
