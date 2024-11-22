import { useState, useContext } from "react";
import "./UploadPic.css";
import { firebaseAuth } from "../Firebase";
import { updateProfile } from "firebase/auth";
import context from "../contexts/auth/context";

export default function UploadPic() {
  const { user } = useContext(context);
  const [imgSrc, setImgSrc] = useState(user.photoURL);

  console.log(user);

  function handleChange(event) {
    console.log(event.target.files[0]);
    let file = URL.createObjectURL(event.target.files[0]);
    setImgSrc(file);
  }
  console.log(imgSrc);

  const sendToFirebase = () => {
    if (imgSrc == user.photoURL) {
      console.log("choose an image");
      return;
    }
    updateProfile(firebaseAuth.currentUser, {
      //   displayName: "Jane Q. User",
      photoURL: imgSrc,
    })
      .then(() => {
        console.log("picture uploaded");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="upload-pic">
      <label htmlFor="profile-pic">Hi</label>
      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={(event) => {
          handleChange(event);
        }}
        id="profile-pic"
      />
      <img
        src={imgSrc}
        alt="profile picture"
        className="rounded-circle profile-pic"
      />
      <button
        type="button"
        className="btn btn-secondary"
        onClick={sendToFirebase}
      >
        Upload
      </button>
    </div>
  );
}
