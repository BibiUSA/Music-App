import "./Friends.css";
import { Link } from "react-router-dom";
import axios from "../config/axios";
import { useState, useContext, useEffect } from "react";
import context from "../contexts/auth/context";

export default function Friends() {
  const { user } = useContext(context);
  const [offset, setOffset] = useState(0);
  console.log("friend user", user.displayName);

  const [friendList, setFriendList] = useState([]);

  const getAllFriends = async () => {
    try {
      const result = await axios.get("/user/allfriends", {
        params: { user: user.displayName, offset: 0 },
      });
      setFriendList(result.data.rows);
      console.log(result.data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFriends();
  }, [offset]);

  const yourFriends = friendList.map((friend) => {
    return (
      <Link key={friend.username} to={`/friend/${friend.username}`}>
        <div className="friendBox">
          <img src={friend.img_url} className="friend_img"></img>
          <p>{friend.username}</p>
        </div>
      </Link>
    );
  });

  return (
    <div className="friends">
      <div className="heading">
        <h4>Friends</h4>
      </div>
      <div className="friends-list">{yourFriends}</div>
    </div>
  );
}
