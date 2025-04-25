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
import { environment } from "../environment";

export default function useShare() {
  const { user } = useContext(context);

  async function openChat(item) {
    const friend = item[0];
    const message = item[1];
    const tile_id = item[2];
    const tile_link = item[3];
    const combinedId =
      friend.uid > user.uid ? friend.uid + user.uid : user.uid + friend.uid;
    environment.development && console.log(friend, user);

    try {
      //checks to see if chat already exists
      const docRef = doc(firebaseDb, "chats", combinedId);
      const res = await getDoc(docRef);

      //if not starts the conversation in "chats" and stores "userChats"
      if (!res.exists()) {
        environment.development && console.log("this ran");
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

      //updates just these values
      await updateDoc(doc(firebaseDb, "userChats", user.uid), {
        [`${combinedId}.userinfo`]: {
          uid: friend.uid,
          displayName: friend.username,
          photoUrl: friend.img_url,
        },
        [`${combinedId}.date`]: serverTimestamp(),
      });

      //stores one for the other user, updates only these values
      await updateDoc(doc(firebaseDb, "userChats", friend.uid), {
        [`${combinedId}.userinfo`]: {
          uid: user.uid,
          displayName: user.displayName,
          photoUrl: user.photoURL,
        },
        [`${combinedId}.date`]: serverTimestamp(),
      });

      //Check to see if userChat between 2 users, especially the receiving user exists
      const docRef1 = doc(firebaseDb, "userChats", friend.uid);
      const res1 = await getDoc(docRef1);

      //if it exists, check to see if "seen" exists and if seen is not false, set as false
      //and increment unseenMessage by 1
      if (res1.exists()) {
        environment.development && console.log("RAN");
        const data = res1.data();
        const seen = data[combinedId]?.lastMessage?.seen;

        if (seen !== false) {
          const docRef2 = doc(firebaseDb, "unseenMessages", friend.uid);
          const res2 = await getDoc(docRef2);
          //IF MESSAGE NOTIFICATION HASN"T BEEN CREATED, create one
          if (!res2.exists()) {
            await setDoc(doc(firebaseDb, "unseenMessages", friend.uid), {
              unseenMessage: 1,
            });
          } else {
            await updateDoc(doc(firebaseDb, "unseenMessages", friend.uid), {
              unseenMessage: increment(1),
            });
          }
        }
      } else {
        await setDoc(
          doc(firebaseDb, "unseenMessages", check.data.rows[0].firebase_uid),
          {
            unseenMessage: increment(1),
          }
        );
      }

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

      //so that if last message wasn't seen by the sender, it won't be marked as seen
      const docRef3 = doc(firebaseDb, "userChats", user.uid);
      const res3 = await getDoc(docRef3);

      if (res3.exists()) {
        const data = res3.data();
        const seen = data[combinedId]?.lastMessage?.seen;

        if (seen !== false) {
          await updateDoc(doc(firebaseDb, "userChats", user.uid), {
            [combinedId]: {
              userinfo: {
                uid: friend.uid,
                displayName: friend.username,
                photoUrl: friend.img_url,
              },
              lastMessage: {
                message: message,
                seen: true,
              },
              date: serverTimestamp(),
            },
          });
        } else {
          await updateDoc(doc(firebaseDb, "userChats", user.uid), {
            [combinedId]: {
              userinfo: {
                uid: friend.uid,
                displayName: friend.username,
                photoUrl: friend.img_url,
              },
              lastMessage: {
                message: message,
                seen: false,
              },
              date: serverTimestamp(),
            },
          });
        }
      }

      await updateDoc(doc(firebaseDb, "userChats", friend.uid), {
        [combinedId]: {
          userinfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          },
          lastMessage: {
            message: message,
            seen: false,
          },
          date: serverTimestamp(),
        },
      });

      // console.log(props.changePartner);
    } catch (error) {
      environment.development && console.log(error);
    }
  }
  return { openChat };
}
