//Have information about Friend. Used on their profile page

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import context from "../contexts/auth/context";
import axios from "axios";

export default function FriendProfile() {
  const { user } = useContext(context);
  const friendName = useParams().friend;
  const [friendInfo, setFriendInfo] = useState("");

  const getFriendInfo = async () => {
    console.log("FRIEND", friendName);
    try {
      const response = await axios.get(`http://localhost:8080/user/friend`, {
        params: { friend: friendName, user: user.displayName },
      });
      setFriendInfo(response.data.rows[0]);
      console.log("FRIEND INFO", response);
    } catch (error) {
      console.log(error);
    }
  };

  //this is so when you're on a friend page and loads another friend page, the content updates
  useEffect(() => {
    // if (friendInfo == "") {
    //   getFriendInfo();
    // }
    getFriendInfo();
  }, [friendName]);

  return (
    <div className="ProfileInfo">
      <img
        src={
          friendInfo
            ? friendInfo.img_url
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        className="rounded-circle img-fluid profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">{friendInfo.username}</h5>

        <Link>
          <button type="button" className="btn btn-primary">
            Add Friend
          </button>
        </Link>
      </div>
    </div>
  );
}
