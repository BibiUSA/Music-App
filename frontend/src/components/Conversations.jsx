import "./Conversations.css";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import context from "../contexts/auth/context";
import { useContext, useState, useEffect } from "react";
import { firebaseDb } from "../Firebase";
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
          setSelected(convo[0]);
          props.changePartner(convo);
        }}
      >
        <img className="eachConvoImg" src={convo[1]["userinfo"]["photoUrl"]} />
        <div className="eachConvoInfo">
          <h6 className="partnerName">{convo[1]["userinfo"]["displayName"]}</h6>
          <p>
            {/* {convo[1]["lastMessage"]?["say"]
              ? convo[1]["lastMessage"]["say"]
              : "Chat"} */}
          </p>
          <p className="time">{time.slice(0, -5)}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="conversations">
      {spreadConvo}
      {/* <div className="eachConvo">
        <img
          className="eachConvoImg"
          src="https://thedecisionlab.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fthedecisionlab%2Fcc70a04a-f6a5-40fd-9799-4a61b89e51bc_barack-obama.png%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C400%2C400%26w%3D400%26h%3D400&w=3840&q=75"
        />
        <div className="eachConvoInfo">
          <p>Chat Username</p>
          <p>2 hours ago</p>
        </div>
      </div> */}
    </div>
  );
}
