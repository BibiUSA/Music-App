//Have information about the Signed in User. Used on their profile page
import "./ProfileInfo.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function ProfileInfo() {
  return (
    <div className="ProfileInfo">
      <img
        src="public/assets/compressed.jpeg"
        className="rounded-circle img-fluid profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">Bibi Mathew</h5>
        <Link to="/account">
          <button type="button" className="btn btn-primary">
            Create a Post
          </button>
        </Link>
      </div>
    </div>
  );
}
