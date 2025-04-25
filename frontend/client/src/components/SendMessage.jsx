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
import { environment } from "../environment";

export default function SendMessage(props) {
  const [message, setMessage] = useState("");
  environment.development && console.log(props);
  const { user } = useContext(context);
  environment.development && console.log(user);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && message.length > 0) {
      environment.development && console.log("Entered");
      try {
        await updateDoc(doc(firebaseDb, "chats", props.partner["combinedId"]), {
          messages: arrayUnion({
            id: uuidv4(),
            text: message,
            senderId: user.uid,
            date: Timestamp.now(),
          }),
        });

        setMessage("");

        //Check to see if userChat between 2 users, especially the receiving user exists
        const docRef = doc(firebaseDb, "userChats", props.partner["uid"]);
        const res = await getDoc(docRef);

        //if it exists, check to see if "seen" exists and if seen is not false, set as false
        //and increment unseenMessage by 1
        if (res.exists()) {
          environment.development && console.log("RAN");
          const data = res.data();
          const seen = data[props.partner["combinedId"]]?.lastMessage?.seen;

          if (seen !== false) {
            const docRef2 = doc(
              firebaseDb,
              "unseenMessages",
              props.partner["uid"]
            );
            const res2 = await getDoc(docRef2);
            //IF MESSAGE NOTIFICATION HASN"T BEEN CREATED, create one
            if (!res2.exists()) {
              await setDoc(
                doc(firebaseDb, "unseenMessages", props.partner["uid"]),
                { unseenMessage: 1 }
              );
            } else {
              await updateDoc(
                doc(firebaseDb, "unseenMessages", props.partner["uid"]),
                {
                  unseenMessage: increment(1),
                }
              );
            }
          }
        } else {
          await setDoc(
            doc(firebaseDb, "unseenMessages", props.partner["uid"]),
            {
              unseenMessage: increment(1),
            }
          );
        }

        //make sure convo been sender and receiver exists and set senders to seen
        await updateDoc(doc(firebaseDb, "userChats", user.uid), {
          [props.partner["combinedId"]]: {
            userinfo: {
              uid: props.partner["uid"],
              displayName: props.partner["displayName"],
              photoUrl: props.partner["img_url"],
            },
            lastMessage: {
              message,
              seen: true,
            },
            date: serverTimestamp(),
          },
        });

        //make sure convo been sender and receiver exists and set receivers to not seen
        await updateDoc(doc(firebaseDb, "userChats", props.partner["uid"]), {
          [props.partner["combinedId"]]: {
            userinfo: {
              uid: user.uid,
              displayName: user.displayName,
              photoUrl: user.photoURL,
            },
            lastMessage: {
              message,
              seen: false,
            },
            date: serverTimestamp(),
          },
        });

        environment.development && console.log("done");
      } catch (error) {
        environment.development && console.log(error);
      }
    }
  };
  environment.development && console.log("wow");

  return (
    <div className="sendMessage">
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
