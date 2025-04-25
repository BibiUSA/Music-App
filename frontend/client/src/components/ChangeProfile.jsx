import "./ChangeProfile.css";
import { useContext, useState } from "react";
import UploadPic from "./UploadPic.jsx";
import context from "../contexts/auth/context.jsx";
import { environment } from "../environment.js";

export default function ChangeProfile() {
  const { user } = useContext(context);
  const [pic, setPic] = useState(false);
  environment.development && console.log(user);

  const editPic = () => {
    if (pic == false) {
      setPic(true);
    } else {
      setPic(false);
    }
  };

  return (
    <div className="changeProfileDiv">
      <section className="changeProfile">
        <img
          src={user.photoURL}
          alt="profile picture"
          className="rounded-circle profile-pic"
        />
        <div>
          <h3>{user?.displayName?.length <= 25 ? user.displayName : ""}</h3>
          {/* <p>{`${user.f}`}</p> */}
        </div>
        <button
          type="button"
          className="btn btn-primary button-x"
          onClick={editPic}
        >
          Change Profile Photo
        </button>
      </section>
      {pic && <UploadPic />}
    </div>
  );
}
