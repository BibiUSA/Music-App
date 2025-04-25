//Have information about Friend. Used on their profile page

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import context from "../contexts/auth/context";
import axios from "../config/axios";
import { environment } from "../environment";

export default function FriendProfile() {
  const { user } = useContext(context);
  const friendName = useParams().friend;
  const [friendInfo, setFriendInfo] = useState("");
  const [friendButton, setFriendButton] = useState("Send Friend Request");

  const getFriendInfo = async () => {
    environment.development && console.log("FRIEND", friendName);
    try {
      const response = await axios.get(`/user/friend`, {
        params: { friend: friendName, user: user.displayName },
      });
      setFriendInfo(response.data.rows[0]);
      environment.development && console.log("FRIEND INFO", response);
    } catch (error) {
      environment.development && console.log(error);
    }
  };

  //this is so when you're on a friend page and loads another friend page, the content updates
  useEffect(() => {
    // if (friendInfo == "") {
    //   getFriendInfo();
    // }
    getFriendInfo();
  }, [friendName]);

  useEffect(() => {
    // if (friendInfo == "") {
    //   getFriendInfo();
    // }
    friendButtonSettings();
  }, [friendInfo]);

  const friendButtonSettings = () => {
    if (!friendInfo.connectid) {
      if (friendButton != "Send Friend Request") {
        setFriendButton("Send Friend Request");
      }
    } else if (friendInfo.accept1 && friendInfo.accept2) {
      setFriendButton("Remove Friend");
    } else if (friendInfo.friend1 == user.displayName) {
      if (friendInfo.accept1) {
        setFriendButton("Cancel Friend Request");
      } else {
        setFriendButton("Accept Friend Request");
      }
    } else if (friendInfo.friend2 == user.displayName) {
      if (friendInfo.accept2) {
        setFriendButton("Cancel Friend Request");
      } else {
        setFriendButton("Accept Friend Request");
      }
    }
  };

  const friendButtonAction = async () => {
    environment.development && console.log("RUNNING");
    try {
      const result = await axios.patch(`/user/updatefriend`, {
        user: user.displayName,
        friend: friendName,
        action: friendButton,
      });
      getFriendInfo();
      environment.development && console.log(result);
    } catch (error) {
      environment.development && console.log(error);
    }
  };

  return (
    <div className="ProfileInfo">
      <img
        src={
          friendInfo
            ? friendInfo.img_url
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        className="rounded-circle profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">{friendInfo.username}</h5>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => friendButtonAction()}
        >
          {friendButton}
        </button>
      </div>
    </div>
  );
}
