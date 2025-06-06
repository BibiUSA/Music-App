import "./Notification.css";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import context from "../contexts/auth/context";
import { firebaseDb } from "../Firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {
  doesDocumentExist,
  resetNotifications,
} from "../Services/firebaseCalls";
import OutsideClickHandler from "react-outside-click-handler";

export default function Notification(props) {
  const { user } = useContext(context);
  const [fullNotifications, setFullNotifucations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await doesDocumentExist("notifications", user.uid, true);
        if (result) {
          setFullNotifucations([
            result.newLikes,
            result.newFriendRequest,
            [result.likeNews],
            [result.friendRequestNews],
          ]);
        }
        await resetNotifications(user.uid);
      } catch (error) {
        console.log(error);
      }
    };
    user && fetchData();
  }, []);

  console.log(fullNotifications);

  const peopleThatLiked = () => {
    if (fullNotifications.length > 0) {
      return fullNotifications[2].join("");
    }
  };

  let friendRequestNewsSpread;
  if (fullNotifications.length > 0) {
    friendRequestNewsSpread = fullNotifications[3].map((news) => {
      return <p key={news}>{news}</p>;
    });
  }

  return (
    <div className="notifcationWindow">
      <OutsideClickHandler
        className="notifcationWindow"
        onOutsideClick={() => {
          props.closeNotificationWindow(true);
        }}
      >
        <Link
          onClick={() => props.closeNotificationWindow(true)}
          className="your-profile"
          to={user ? "/profile" : "/login"}
        >
          <img
            src={
              user
                ? user.photoURL
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            className="your-pic"
          ></img>
          <h4 className="name-title">
            {user ? user.displayName : "Your Profile"}
          </h4>
        </Link>
        <div className="notification-section">
          <p>{`${fullNotifications[0]} new likes since last time you checked.`}</p>
          <p>{`${fullNotifications[1]} new friend requests or friendship acceptance since last time you checked.`}</p>
          {fullNotifications[0] > 0 && <h6>People who liked your posts.</h6>}
          {fullNotifications[0] > 0 && <p>{peopleThatLiked()} </p>}
          {fullNotifications[1] > 0 && <h6>Friendship Status</h6>}
          {fullNotifications[1] > 0 && <div>{friendRequestNewsSpread}</div>}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
