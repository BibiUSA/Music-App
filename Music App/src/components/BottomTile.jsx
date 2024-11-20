//Bottom part of the tile/post component. Contains buttons for liking, messaging
import "./BottomTile.css";
import {
  IconHeart,
  IconMessageUser,
  IconHeartFilled,
  IconDots,
} from "@tabler/icons-react";
import { useState, useEffect, useContext } from "react";
import context from "../contexts/auth/context";
import axios from "axios";

export default function BottomTile(data) {
  const [heart, setHeart] = useState(<IconHeart stroke={2} className="icon" />); //fills up the heart
  const [liked, setLiked] = useState("notLiked"); //just to see if its liked because comparing html value above is harder
  const [message, setMessage] = useState("");
  const { user } = useContext(context);
  const tileData = data.data;

  console.log(user);
  console.log(tileData);

  useEffect(() => {
    if (tileData.username) {
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
    }
  }, []);

  const changeHeart = () => {
    if (liked === "notLiked") {
      likePost(tileData.tile_id, user.displayName);
      // setLiked("liked");
      // setHeart(<IconHeartFilled className="heart" />);
    } else {
      unLikePost(tileData.tile_id, user.displayName);
    }
  };

  function handleChange(event) {
    setMessage(`${event}`);
  }

  const likePost = async (tile_id, username) => {
    try {
      const result = await axios.post(`http://localhost:8080/create/likepost`, {
        tile_id: tile_id,
        username: username,
      });
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const unLikePost = async (tile_id, username) => {
    try {
      const result = await axios.delete(
        `http://localhost:8080/create/unlikepost`,
        {
          tile_id: tile_id,
          username: username,
        }
      );
      setLiked("notLiked");
      setHeart(<IconHeart stroke={2} className="icon" />);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bottomTile">
      <div className="icons">
        <div onClick={changeHeart}>{heart}</div>
        <IconMessageUser stroke={2} className="icon" />
        <IconDots stroke={2} className="icon" />
      </div>
      <input
        className="messageOwner"
        type="textarea"
        placeholder="Send Message"
        value={message}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      ></input>
    </div>
  );
}
