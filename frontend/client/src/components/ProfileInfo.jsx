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
        src={
          user
            ? user.photoURL
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        className=" profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">
          {user?.displayName?.length <= 25 ? user.displayName : ""}
        </h5>
        {user ? (
          <div className="setting-link">
            <Link to="/settings">
              <p className="settings-name">settings</p>
              <IconSettingsCog stroke={1.5} width={20} height={20} />
            </Link>
          </div>
        ) : (
          <div className="setting-link">
            <Link onClick={() => signinAlert("adjust settings")}>
              <p className="settings-name">settings</p>
              <IconSettingsCog stroke={1.5} width={20} height={20} />
            </Link>
          </div>
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
        {!user && (
          <Link to="/login">
            <button type="button" className="btn btn-primary">
              Log In and Register
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
