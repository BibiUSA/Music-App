//Have information about the Signed in User. Used on their profile page
import "./ProfileInfo.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconSettingsCog } from "@tabler/icons-react";
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
        <Link to="/settings">
          <IconSettingsCog stroke={1.5} width={40} height={40} />
        </Link>
        <Link to="/account">
          <button type="button" className="btn btn-primary">
            Create a Post
          </button>
        </Link>
        <br></br>
        <Link to="/login">
          <button type="button" className="btn btn-primary">
            Log In and Register
          </button>
        </Link>
      </div>
    </div>
  );
}
