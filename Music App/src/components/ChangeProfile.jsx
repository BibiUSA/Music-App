import "./ChangeProfile.css";

import UploadPic from "./UploadPic.jsx";

export default function ChangeProfile() {
  return (
    <div>
      <section className="changeProfile">
        <img
          src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt="profile picture"
          className="rounded-circle profile-pic"
        />
        <div>
          <p>username</p>
          <p>First Last</p>
        </div>
        <button type="button" className="btn btn-primary button-x">
          Change Profile Photo
        </button>
      </section>
      <UploadPic />
    </div>
  );
}
