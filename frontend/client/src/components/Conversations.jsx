import "./Conversations.css";
import {
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import context from "../contexts/auth/context";
import { useContext, useState, useEffect } from "react";
import { firebaseDb } from "../Firebase";
import { isMobile } from "../utils/isMobile.js";

//shows the list of people the user is having conversations with

export default function Conversations(props) {
  const { user } = useContext(context);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(firebaseDb, "userChats", user.uid),
        (doc) => {
          setChats(Object.entries(doc.data()));
        }
      );

      return () => {
        unsub();
      };
    };
    user.uid && getChats();
  }, [user.uid]);

  const setAsSeen = async (convoID) => {
    try {
      const docRef = doc(firebaseDb, "userChats", user.uid);
      const res = await getDoc(docRef);

      const data = res.data();

      console.log("HERE", data[convoID]["lastMessage"]["seen"]);
      if (data[convoID]["lastMessage"]["seen"] == false) {
        await updateDoc(doc(firebaseDb, "userChats", user.uid), {
          [`${convoID}.lastMessage.seen`]: true,
        });
        await updateDoc(doc(firebaseDb, "unseenMessages", user.uid), {
          unseenMessage: increment(-1),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(Object.entries(chats)[0][1][1]["date"]);

  const spreadConvo = chats.map((convo) => {
    let time = new Date(0);
    time.setSeconds(convo[1]["date"]);
    time = time.toDateString();
    console.log(time);
    console.log(convo[1]["date"]);
    return (
      <div
        className={selected == convo[0] ? "selectedConvo" : "eachConvo"}
        key={convo[0]}
        //passes info on who you chose to have a convo with
        onClick={() => {
          setAsSeen(convo[0]);
          console.log(convo[0]);
          setSelected(convo[0]);
          props.changePartner(convo);
        }}
      >
        <img className="eachConvoImg" src={convo[1]["userinfo"]["photoUrl"]} />
        <div className="eachConvoInfo">
          <h6 className="partnerName">{convo[1]["userinfo"]["displayName"]}</h6>
          <p className={convo[1]?.lastMessage?.seen == false ? "boldMssg" : ""}>
            {/* causes bugs when there is no last message */}
            {convo[1]?.lastMessage?.message == "noMssgYet0000"
              ? ""
              : convo[1]["lastMessage"]["message"]}
          </p>
          <p className="time">{time.slice(0, -5)}</p>
        </div>
      </div>
    );
  });

  return (
    <div
      className={
        isMobile() ? "conversations-mobile conversations" : "conversations"
      }
    >
      {spreadConvo}
    </div>
  );
}
