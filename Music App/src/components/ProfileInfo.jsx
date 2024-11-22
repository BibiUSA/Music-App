//Have information about the Signed in User. Used on their profile page
import "./ProfileInfo.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconSettingsCog } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function ProfileInfo(data) {
  console.log("DATA", data);

  const signinAlert = () => {
    setTimeout(function () {
      alert("Log in to like posts.");
    }, 1);
  };

  return (
    <div className="ProfileInfo">
      <img
        src="public/assets/compressed.jpeg"
        className="rounded-circle img-fluid profilePic"
      ></img>
      <div className="card">
        <h5 className="card-title">
          {data.data ? data.data.displayName : "Your Username"}
        </h5>
        <Link to="/settings">
          <IconSettingsCog stroke={1.5} width={40} height={40} />
        </Link>
        {data.data ? (
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
              onClick={signinAlert}
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
