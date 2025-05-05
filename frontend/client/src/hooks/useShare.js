import { useContext } from "react";
import context from "../contexts/auth/context";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
  increment,
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { v4 as uuidv4 } from "uuid";
import {
  updateUserChat,
  sendAMessage,
  setSeenLastMssgTime,
} from "../Services/firebaseCalls";

export default function useShare() {
  const { user } = useContext(context);

  async function openChat(item) {
    const friend = item[0];
    const message = item[1];
    const tile_id = item[2];
    const tile_link = item[3];
    const combinedId =
      friend.uid > user.uid ? friend.uid + user.uid : user.uid + friend.uid;
    console.log("FRIEND", friend.img_url, "SENDER", user);

    try {
      //checks to see if chat already exists
      const docRef = doc(firebaseDb, "chats", combinedId);
      const res = await getDoc(docRef);

      //if not starts the conversation in "chats" and stores "userChats"
      if (!res.exists()) {
        console.log("this ran");
        await setDoc(doc(firebaseDb, "chats", combinedId), { messages: [] });
        //stores the conversation under the logged in user
      }
      console.log("Message", message);
      sendAMessage(combinedId, message, user.uid, {
        id: tile_id,
        link: tile_link,
      });

      setSeenLastMssgTime(
        "userChats",
        friend.uid,
        true,
        combinedId,
        friend.uid,
        friend.username,
        friend.img_url,
        user.uid,
        user.displayName,
        user.photoURL,
        message,
        "no"
      );
    } catch (error) {
      console.log(error);
    }
  }
  return { openChat };
}
