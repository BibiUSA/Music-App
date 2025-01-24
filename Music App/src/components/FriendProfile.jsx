//Have information about Friend. Used on their profile page

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import context from "../contexts/auth/context";

export default function FriendProfile() {
  const { user } = useContext(context);

  return (
    <div className="ProfileInfo">
      <img
        src={
          user
            ? user.photoURL
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        className="rounded-circle img-fluid profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">
          {user?.displayName?.length <= 25 ? user.displayName : ""}
        </h5>

        <Link>
          <button type="button" className="btn btn-primary">
            Add Friend
          </button>
        </Link>
      </div>
    </div>
  );
}
