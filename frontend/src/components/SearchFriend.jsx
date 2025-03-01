// for searching users to send messages to
import "./searchFriend.css";
import useSearchFriend from "../hooks/useSearchFriend";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { useState, useContext, useEffect } from "react";
import context from "../contexts/auth/context";
import OutsideClickHandler from "react-outside-click-handler";

export default function SearchFriend(props) {
  const { friendMatch, searchFriend } = useSearchFriend();
  const [search, setSearch] = useState("");
  const { user } = useContext(context);
  const [searching, setSearching] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  //check to see if friend is the selected friend list
  const checkFriend = (friend) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(friend.firebase_uid)) {
        return prevSelected.filter((id) => id !== friend.firebase_uid);
      } else {
        return [...prevSelected, friend.firebase_uid];
      }
    });
  };

  props.getFriends(selectedFriends);

  const searchFriendPlus = async (event) => {
    setSearch(event.target.value);
    //might need a way to wait till setSearch is done
    searchFriend(search, user.displayName);
  };

  async function openChat(friend) {
    const combinedId =
      friend.firebase_uid > user.uid
        ? friend.firebase_uid + user.uid
        : user.uid + friend.firebase_uid;
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

      const docRefThree = doc(firebaseDb, "userChats", friend.firebase_uid);
      const resThree = await getDoc(docRefThree);

      if (!resThree.exists()) {
        await setDoc(doc(firebaseDb, "userChats", friend.firebase_uid), {});
      }

      await updateDoc(doc(firebaseDb, "userChats", user.uid), {
        [combinedId]: {
          userinfo: {
            uid: friend.firebase_uid,
            displayName: friend.username,
            photoUrl: friend.img_url,
          },
          date: serverTimestamp(),
        },
      });

      //stores one for the other user
      await updateDoc(doc(firebaseDb, "userChats", friend.firebase_uid), {
        [combinedId]: {
          userinfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          },
          date: serverTimestamp(),
        },
      });
      //   props.changePartner({
      //     0: combinedId,
      //     1: {
      //       date: "",
      //       userinfo: {
      //         displayName: friend.username,
      //         photoUrl: friend.img_url,
      //         uid: friend.firebase_uid,
      //       },
      //     },
      //   });
      setSearching(false);
      // console.log(props.changePartner);
    } catch (error) {
      console.log(error);
    }
  }

  const spreading = friendMatch.map((friend) => {
    return (
      <div
        key={friend.username}
        className={
          selectedFriends.includes(friend.firebase_uid)
            ? "clickedFriend"
            : "friendResult"
        }
        onClick={() => {
          checkFriend(friend);
        }}
      >
        <img className="friendResultImg" src={friend.img_url}></img>{" "}
        <span>{friend.username}</span>
        <div className="friendCheck">
          {selectedFriends.includes(friend.firebase_uid) && (
            <div className="checked"></div>
          )}
        </div>
      </div>
    );
  });

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setSearching(false);
      }}
    >
      <div className="searchMessage" onFocus={() => setSearching(true)}>
        <input
          className="seachboxMessage"
          onChange={(event) => searchFriendPlus(event)}
          value={search}
          type="text"
          placeholder="Enter User to Chat"
        />
        {/* {searching && <div className="friendTotal">{spreading}</div>} */}
        <div className="friendTotals">{spreading}</div>
      </div>
    </OutsideClickHandler>
  );
}
