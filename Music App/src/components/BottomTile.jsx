//Bottom part of the tile/post component. Contains buttons for liking, messaging
import "./BottomTile.css";
import {
  IconHeart,
  IconMessageUser,
  IconHeartFilled,
} from "@tabler/icons-react";
import { useState } from "react";

export default function BottomTile() {
  const [heart, setHeart] = useState(<IconHeart stroke={2} className="icon" />);
  const [liked, setLiked] = useState("notLiked");
  const [message, setMessage] = useState("");

  const changeHeart = () => {
    if (liked === "notLiked") {
      setLiked("liked");
      setHeart(<IconHeartFilled className="heart" />);
    } else {
      setLiked("notLiked");
      setHeart(<IconHeart stroke={2} className="icon" />);
    }
  };

  function handleChange(event) {
    setMessage(`${event}`);
  }

  return (
    <div className="bottomTile">
      <div className="icons">
        <div onClick={changeHeart}>{heart}</div>
        <IconMessageUser stroke={2} className="icon" />
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
