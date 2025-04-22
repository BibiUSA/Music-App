//for sending messages to those who you are sharing the video clips
import { useState } from "react";
import "./MessageShare.css";
import useShare from "../hooks/useShare";

export default function MessageShare(props) {
  const [shareMssg, setShareMssg] = useState("");
  const { openChat } = useShare();
  console.log("CHILDREN", props);

  const share = () => {
    if (props.friends.length < 1) {
      return;
    }
    for (let i = 0; i < props.friends.length; i++) {
      openChat([
        props.friends[i],
        shareMssg,
        props.tileData.tile_id,
        props.tileData.tile_link,
      ]);
    }
    props.close();
  };

  return (
    <div className="MessageShare">
      <p>{`FRIENDS SELECTED : ${props.friends.length}`}</p>
      <input
        className="shareMessage"
        type="textarea"
        onChange={(event) => {
          setShareMssg(event.target.value);
        }}
        value={shareMssg}
      ></input>
      <button
        className={props.friends.length > 0 ? "shareButton" : "preshareButton"}
        onClick={() => share()}
      >
        Share
      </button>
    </div>
  );
}
