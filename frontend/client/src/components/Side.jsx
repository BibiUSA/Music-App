import "./Side.css";
import SearchMessage from "./SearchMessage";
import Conversations from "./Conversations";
import { useState } from "react";

export default function Side(props) {
  const [convoPartner, setConvoPartner] = useState([]);

  const getConvoPartner = (data) => {
    setConvoPartner(data);
    console.log("made it to parent", data);
    props.getPartner(data);
  };

  console.log(convoPartner);

  return (
    <div className="side">
      <SearchMessage changePartner={getConvoPartner} />
      <Conversations changePartner={getConvoPartner} />
    </div>
  );
}
