// for searching users to send messages to
import "./SearchFriend.css";
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
    console.log(friend);
    setSelectedFriends((prevSelected) => {
      if (prevSelected?.some((obj) => obj.uid == friend.firebase_uid)) {
        console.log("found");
        // return delete prevSelected[friend.firebase_uid];
        return prevSelected.filter((id) => id.uid !== friend.firebase_uid);
      } else {
        return [
          ...prevSelected,
          {
            uid: friend.firebase_uid,
            username: friend.username,
            img_url: friend.img_url,
          },
        ];
      }
    });
  };

  console.log(selectedFriends);

  //gets data to the parent
  props.getFriends(selectedFriends);

  const searchFriendPlus = async (event) => {
    setSearch(event.target.value);
    if (!user) {
      return;
    }
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

      //checks to see if the userChat is there- where last message is stored
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
          lastMessage: {
            message: "noMssgYet0000",
            seen: true,
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
          lastMessage: {
            message: "noMssgYet0000",
            seen: true,
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
          searchFriend[friend.firebase_uid]
            ? //   selectedFriends.includes(friend.firebase_uid)
              "clickedFriend"
            : "friendResult"
        }
        onClick={() => {
          checkFriend(friend);
        }}
      >
        <img className="friendResultImg" src={friend.img_url}></img>{" "}
        <span>{friend.username}</span>
        <div className="friendCheck">
          {Array.isArray(selectedFriends) &&
            selectedFriends.some((obj) => obj.uid == friend.firebase_uid) && (
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
      <div className="searchFriend" onFocus={() => setSearching(true)}>
        <input
          className="seachboxMessage"
          onChange={(event) => searchFriendPlus(event)}
          value={search}
          type="text"
          placeholder="Enter User to Chat"
        />
        {/* {searching && <div className="friendTotal">{spreading}</div>} */}
        {searching && <div className="friendTotals">{spreading}</div>}
      </div>
    </OutsideClickHandler>
  );
}
