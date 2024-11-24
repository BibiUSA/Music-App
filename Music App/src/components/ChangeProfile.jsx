import "./ChangeProfile.css";
import { useContext, useState } from "react";
import UploadPic from "./UploadPic.jsx";
import context from "../contexts/auth/context.jsx";

export default function ChangeProfile() {
  const { user } = useContext(context);
  console.log(user);

  return (
    <div>
      <section className="changeProfile">
        <img
          src={user.photoURL}
          alt="profile picture"
          className="rounded-circle profile-pic"
        />
        <div>
          <p>username</p>
          {/* <p>{`${user.f}`}</p> */}
        </div>
        <button type="button" className="btn btn-primary button-x">
          Change Profile Photo
        </button>
      </section>
      <UploadPic />
    </div>
  );
}
