import "./Share.css";
import SearchFriend from "./SearchFriend";
import MessageShare from "./MessageShare";
import { useState } from "react";

export default function Share(props) {
  const [childFriends, setChildFriends] = useState([]);
  console.log("parentprops", props);

  const getState = (list) => {
    setChildFriends(list);
  };

  console.log("parent", childFriends);

  return (
    <div className="share">
      <div className="header">
        <button
          className="close"
          onClick={() => {
            props.close();
          }}
        >
          x
        </button>
      </div>

      <div className="mssgShare">
        <MessageShare
          friends={childFriends}
          tileData={props.tileData}
          close={props.close}
        />
      </div>
      <SearchFriend getFriends={getState} />
    </div>
  );
}
