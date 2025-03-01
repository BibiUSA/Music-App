import EachMessage from "./EachMessage";
import { firebaseDb } from "../Firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./ConvoMessage.css";

export default function ConvoMessage(props) {
  const [totalMess, setTotalMess] = useState([]);

  useEffect(() => {
    if (Object.keys(props.partner).length > 0) {
      const unSub = onSnapshot(
        doc(firebaseDb, "chats", props.partner["combinedId"]),
        (doc) => {
          doc.exists() && setTotalMess(doc.data().messages);
        }
      );
      return () => {
        unSub();
      };
    }
  }, [props.partner["combinedId"]]);

  console.log(totalMess);

  // const getPartnerConvo = async () => {
  //   if (Object.keys(props.partner).length > 0) {
  //     const docRef = doc(firebaseDb, "chats", props.partner["combinedId"]);
  //     const res = await getDoc(docRef);
  //     console.log(res);

  // };
  // getPartnerConvo();

  // const docRef = doc(firebaseDb, "chats", combinedId);
  //     const res = await getDoc(docRef);

  return (
    <div className="messages">
      {totalMess.map((message) => {
        return <EachMessage info={message} key={message.id} />;
      })}
    </div>
  );
}
