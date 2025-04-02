import { Link } from "react-router-dom";
import "./Success.css";

export default function Success() {
  return (
    <div className="successbox">
      <h3 className="title">Post Shared Successfully!</h3>
      <div className="options">
        <button className="button" onClick={() => window.location.reload()}>
          Post More
        </button>

        <Link to="/">
          <button className="button">Home Feed</button>
        </Link>
        <Link to="/profile">
          <button className="button">Your Feed</button>
        </Link>
      </div>
    </div>
  );
}
