import { useState } from "react";
import "./MessageShare.css";

export default function MessageShare(props) {
  const [shareMssg, setShareMssg] = useState("");
  console.log("CHILDREN", props);

  const share = () => {};

  return (
    <div className="MessageShare">
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
        onClick={() => share}
      >
        Share
      </button>
    </div>
  );
}
