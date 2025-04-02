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
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { v4 as uuidv4 } from "uuid";

export default function useShare() {
  const { user } = useContext(context);

  //   const logging = (item) => {
  //     const friend = item[0];
  //     const message = item[1];
  //     const tile_id = item[2];
  //     const tile_link = item[3];

  //     console.log(friend);
  //     console.log(message);
  //     console.log(id);
  //     console.log(link);
  //   };

  //   //just for testing
  //   return { logging };

  async function openChat(item) {
    const friend = item[0];
    const message = item[1];
    const tile_id = item[2];
    const tile_link = item[3];
    const combinedId =
      friend.uid > user.uid ? friend.uid + user.uid : user.uid + friend.uid;
    console.log(friend, user);

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

      const docRefTwo = doc(firebaseDb, "userChats", user.uid);
      const resTwo = await getDoc(docRefTwo);

      if (!resTwo.exists()) {
        await setDoc(doc(firebaseDb, "userChats", user.uid), {});
      }

      const docRefThree = doc(firebaseDb, "userChats", friend.uid);
      const resThree = await getDoc(docRefThree);

      if (!resThree.exists()) {
        await setDoc(doc(firebaseDb, "userChats", friend.uid), {});
      }

      await updateDoc(doc(firebaseDb, "userChats", user.uid), {
        [combinedId]: {
          userinfo: {
            uid: friend.uid,
            displayName: friend.username,
            photoUrl: friend.img_url,
          },
          date: serverTimestamp(),
        },
      });

      //stores one for the other user
      await updateDoc(doc(firebaseDb, "userChats", friend.uid), {
        [combinedId]: {
          userinfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          },
          date: serverTimestamp(),
        },
      });

      //SENDING MESSAGE
      await updateDoc(doc(firebaseDb, "chats", combinedId), {
        messages: arrayUnion({
          id: uuidv4(),
          text: message,
          tile: { id: tile_id, link: tile_link },
          senderId: user.uid,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(firebaseDb, "userChats", user.uid), {
        [combinedId]: {
          userinfo: {
            uid: friend.uid,
            displayName: friend.username,
            photoUrl: friend.img_url,
          },
          lastMessage: {
            message,
          },
          date: serverTimestamp(),
        },
      });

      await updateDoc(doc(firebaseDb, "userChats", friend.uid), {
        [combinedId]: {
          userinfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          },
          lastMessage: {
            message,
          },
          date: serverTimestamp(),
        },
      });

      // console.log(props.changePartner);
    } catch (error) {
      console.log(error);
    }
  }
  return { openChat };
}
