//Have information about the Signed in User. Used on their profile page
import "./ProfileInfo.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconSettingsCog } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import context from "../contexts/auth/context";

export default function ProfileInfo() {
  const { user } = useContext(context);
  console.log("WHAT?", user);

  const signinAlert = (action) => {
    setTimeout(function () {
      alert(`Log in to ${action}.`);
    }, 1);
  };

  return (
    <div className="ProfileInfo">
      <img
        src={user ? user.photoURL : "public/assets/compressed.jpeg"}
        className="rounded-circle img-fluid profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">
          {user?.displayName?.length <= 25 ? user.displayName : ""}
        </h5>
        {user ? (
          <Link to="/settings">
            <IconSettingsCog stroke={1.5} width={40} height={40} />
          </Link>
        ) : (
          <Link onClick={() => signinAlert("adjust settings")}>
            <IconSettingsCog stroke={1.5} width={40} height={40} />
          </Link>
        )}

        {user ? (
          <Link to="/account">
            <button type="button" className="btn btn-primary">
              Create a Post
            </button>
          </Link>
        ) : (
          <Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                signinAlert("create a post");
              }}
            >
              Create a Post
            </button>
          </Link>
        )}
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
