// for searching users to send messages to
import "./SearchMessage.css";

export default function SearchMessage() {
  return (
    <div className="searchMessage">
      <input
        className="seachboxMessage"
        type="text"
        placeholder="Enter User to Chat"
      />
    </div>
  );
}
