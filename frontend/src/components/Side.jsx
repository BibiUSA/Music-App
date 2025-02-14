import "./Side.css";
import SearchMessage from "./SearchMessage";
import Conversations from "./Conversations";

export default function Side() {
  return (
    <div className="side">
      <SearchMessage />
      <Conversations />
    </div>
  );
}
