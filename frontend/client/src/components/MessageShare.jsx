//for sending messages to those who you are sharing the video clips
import { useState, useContext } from "react";
import "./MessageShare.css";
import useShare from "../hooks/useShare";
import context from "../contexts/auth/context";

export default function MessageShare(props) {
  const [shareMssg, setShareMssg] = useState("");
  const { openChat } = useShare();
  console.log("CHILDREN", props);
  const { user } = useContext(context);

  const share = () => {
    if (props.friends.length < 1 || !user) {
      return;
    }
    if (props.tileData.starttime) {
      for (let i = 0; i < props.friends.length; i++) {
        console.log(
          "with both",
          props.tileData.starttime,
          props.tileData.endtime
        );
        openChat([
          props.friends[i],
          shareMssg,
          props.tileData.tile_id,
          props.tileData.tile_link,
          props.tileData.starttime,
          props.tileData.endtime,
        ]);
      }
    } else {
      for (let i = 0; i < props.friends.length; i++) {
        console.log("neither");
        openChat([
          props.friends[i],
          shareMssg,
          props.tileData.tile_id,
          props.tileData.tile_link,
        ]);
      }
    }

    props.close();
  };

  return (
    <div className="MessageShare">
      <p>{`FRIENDS SELECTED : ${props.friends.length}`}</p>
      <input
        className="shareMessage"
        type="textarea"
        placeholder="Enter the Message to Share"
        onChange={(event) => {
          setShareMssg(event.target.value);
        }}
        value={shareMssg}
      ></input>
      <button
        className={props.friends.length > 0 ? "shareButton" : "preshareButton"}
        onClick={() => share()}
      >
        {user ? `Share` : `Log In To Share`}
      </button>
    </div>
  );
}
