import "./Friends.css";
import { Link } from "react-router-dom";
import axios from "../config/axios";
import { useState, useContext, useEffect } from "react";
import context from "../contexts/auth/context";
import { environment } from "../environment";

export default function Friends() {
  const { user } = useContext(context);
  const [offset, setOffset] = useState(0);
  const [feed, setFeed] = useState("friends");
  environment.development && console.log("friend user", user.displayName);

  const [friendList, setFriendList] = useState([]);

  const getAllFriends = async () => {
    environment.development && console.log("getting friends");
    try {
      const result = await axios.get("/user/allfriends", {
        params: { user: user.displayName, offset: 0 },
      });
      setFriendList(result.data.rows);
      environment.development && console.log(result.data.rows);
    } catch (error) {
      environment.development && console.log(error);
    }
  };

  const getAllRequests = async () => {
    environment.development && console.log("getting requests");
    try {
      const result = await axios.get("/user/allrequests", {
        params: { user: user.displayName, offset: 0 },
      });
      setFriendList(result.data.rows);
      environment.development && console.log(result.data.rows);
    } catch (error) {
      environment.development && console.log(error);
    }
  };

  const changeFeed = (feedChoice) => {
    if (feed != feedChoice) {
      setFeed(feedChoice);
      setOffset(0);
    }
  };

  useEffect(() => {
    if (feed == "friends") {
      getAllFriends();
    } else if (feed == "requests") {
      getAllRequests();
      environment.development && console.log("requests");
    }
  }, [offset, feed]);

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
        <div
          className={feed == "friends" ? "onButton" : "offButton"}
          onClick={() => {
            changeFeed("friends");
          }}
        >
          Show Friends
        </div>
        <div
          className={feed == "friends" ? "offButton" : "onButton"}
          onClick={() => {
            changeFeed("requests");
          }}
        >
          Show Requests
        </div>
      </div>
      <div className="friends-list">{yourFriends}</div>
    </div>
  );
}
